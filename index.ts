enum Status {
    PEDDING = "pending",
    FULFILLED = "fulfilled",
    REJECTED = "rejected"
};

class PromiseApp {
    public status: Status = Status.PEDDING;
    private value: any;
    private error: any;
    private resolveQueue: any[] = [];
    private rejectedQueue: any[] = [];
    constructor(fn) {
        fn(this.resolve.bind(this), this.reject.bind(this));
    }

    resolve(res): void {
        if (this.status === Status.PEDDING) {
            this.status = Status.FULFILLED
            this.value = res;
            this.resolveQueue.forEach((fn: Function) => {
                fn();
            });
        }
    }

    reject(res): void {
        if (this.status === Status.PEDDING) {
            this.status = Status.REJECTED
            this.error = res;
            this.rejectedQueue.forEach((fn: Function) => fn());
        }
    }

    then (onFullfilled, onRejected) {
        if (this.status === Status.FULFILLED) {
            onFullfilled && onFullfilled(this.value);
        } else if (this.status === Status.REJECTED) {
            onRejected && onRejected(this.error);
        } else {
            this.resolveQueue.push(() =>{
                onFullfilled && onFullfilled(this.value);
            });
            this.rejectedQueue.push(() =>{
                onRejected && onRejected(this.error);
            });
        }
        return this;
    }

    catch (errorFn: Function, error) {
        errorFn && errorFn(error);
    }

    static all (iterators: Array<PromiseApp>) {
        const promises: Array<PromiseApp> = [...iterators];
        let count = 0;
        let res = [];
        return new PromiseApp((resolve, reject) => {
            for(let i = 0; i < promises.length; i++) {
                promises[i].then((respone) => {
                    count++;
                    res[i] = respone;
                    if (count === promises.length) {
                        resolve(res);
                    }
                }, () => {
                    reject();
                });
            }
        });
    }

    // todo
    static race () {}

    // todo
    static resolve() {}

    // todo
    static reject() {}
};

const a = new PromiseApp((resolve, reject) => {
    setTimeout(() => {
        resolve("成功了");
    }, 1000)
});
const b = new PromiseApp((resolve, reject) => {
    resolve("成功了1");
});

PromiseApp.all([a, b]).then(res => {
    console.log(res);
}, () => {});




