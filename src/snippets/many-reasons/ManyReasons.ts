export type ReasonIdentifier = string | symbol | ManyReasons;

export class ManyReasons {
  private readonly reasons: Set<ReasonIdentifier> = new Set();

  public onChange: ((hasReasons: boolean) => void) | null = null;
  public onEmpty: (() => void) | null = null;
  public onNonEmpty: (() => void) | null = null;

  public add(identifier: ReasonIdentifier, forceUnique = false): () => void {
    if (forceUnique && typeof identifier === 'string') {
      identifier = Symbol(identifier);
    }

    this.reasons.add(identifier);

    this.onChange?.(this.hasAny());

    if (this.reasons.size === 1) {
      this.onNonEmpty?.();
    }

    return () => this.remove(identifier);
  }

  public remove(identifier: ReasonIdentifier): void {
    if (this.reasons.has(identifier)) {
      this.reasons.delete(identifier);
      this.onChange?.(this.hasAny());
    }

    if (this.reasons.size === 0) {
      this.onEmpty?.();
    }
  }

  public removeAll() {
    this.reasons.clear();
    this.onChange?.(this.hasAny());
    this.onEmpty?.();
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

  public addDuringPromise<
    T extends { then: (onfulfilled: () => void) => void },
  >(promiseToUnblockAfter: T, identifier: ReasonIdentifier = Symbol()) {
    this.add(identifier);
    promiseToUnblockAfter.then(() => this.remove(identifier));
    return promiseToUnblockAfter;
  }

  public async waitUntilEmpty(): Promise<void> {
    if (this.hasAny()) {
      await new Promise<void>(resolve => {
        const cleanup = () => {
          this.onEmpty = null;
        };
        this.onEmpty = () => {
          cleanup();
          resolve();
        };
      });
    }
  }
  
  public toString() {
    const reasons = [...this.reasons]
      .map(r => (typeof r === 'symbol' ? String(r) : r))
      .join(', ');
    return `[ManyReasons (${reasons})]`;
  }
}
