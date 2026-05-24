export type ReasonIdentifier = string | symbol | ManyReasons;

export class ManyReasons {
  private readonly reasons: Set<ReasonIdentifier> = new Set();
  private readonly emptyResolvers: Set<() => void> = new Set();

  public onChange: ((hasReasons: boolean) => void) | null = null;
  public onEmpty: (() => void) | null = null;
  public onNonEmpty: (() => void) | null = null;

  public add(identifier: ReasonIdentifier, forceUnique = false): () => void {
    const reason =
      forceUnique && typeof identifier === 'string'
        ? Symbol(identifier)
        : identifier;
    const wasEmpty = !this.hasAny();
    const previousSize = this.reasons.size;

    this.reasons.add(reason);

    if (this.reasons.size !== previousSize) {
      this.onChange?.(this.hasAny());

      if (wasEmpty) {
        this.onNonEmpty?.();
      }
    }

    return () => this.remove(reason);
  }

  public remove(identifier: ReasonIdentifier): void {
    if (!this.reasons.delete(identifier)) {
      return;
    }

    this.onChange?.(this.hasAny());

    if (!this.hasAny()) {
      this.notifyEmpty();
    }
  }

  public removeAll() {
    if (!this.hasAny()) {
      return;
    }

    this.reasons.clear();
    this.onChange?.(false);
    this.notifyEmpty();
  }

  public set(identifier: ReasonIdentifier, value: boolean): void {
    if (this.reasons.has(identifier) === value) {
      return;
    }

    if (value) {
      this.add(identifier);
    } else {
      this.remove(identifier);
    }
  }

  public has(identifier: ReasonIdentifier) {
    return this.reasons.has(identifier);
  }

  public hasAny(): boolean {
    return this.reasons.size > 0;
  }

  public makeParentTo(...children: ManyReasons[]): void {
    this.onChange = hasReasons => {
      if (hasReasons) {
        children.forEach(child => child.add(this));
      } else {
        children.forEach(child => child.remove(this));
      }
    };
  }

  public addDuringPromise<T extends PromiseLike<unknown>>(
    promiseToUnblockAfter: T,
    identifier: ReasonIdentifier = Symbol()
  ) {
    this.add(identifier);
    Promise.resolve(promiseToUnblockAfter).then(
      () => this.remove(identifier),
      () => this.remove(identifier)
    );
    return promiseToUnblockAfter;
  }

  public addDuring<T extends PromiseLike<unknown>>(
    identifier: ReasonIdentifier,
    promiseToUnblockAfter: T
  ) {
    return this.addDuringPromise(promiseToUnblockAfter, identifier);
  }

  public async waitUntilEmpty(): Promise<void> {
    if (!this.hasAny()) {
      return;
    }

    await new Promise<void>(resolve => {
      this.emptyResolvers.add(resolve);
    });
  }

  public toString() {
    const reasons = [...this.reasons]
      .map(r => (typeof r === 'symbol' ? String(r) : r))
      .join(', ');
    return `[ManyReasons (${reasons})]`;
  }

  private notifyEmpty() {
    this.onEmpty?.();
    const resolvers = [...this.emptyResolvers];
    this.emptyResolvers.clear();
    resolvers.forEach(resolve => resolve());
  }
}
