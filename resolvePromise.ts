// 处理pormise then 返回值为promise情况的

function resolvePromise(promise2, x, resolve, reject) {
    // 防止循环引用的情况
    if (promise2 === x) {
        return reject(new TypeError("循环引用"))
    }
    // 防止多次调用
    let called;

    // x 不是 null 且 x 是对象或者函数 这里判断promise
    if (x != null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            const then = x.then;
            if (typeof then === "function") {
                then.call(x, (res) => {
                    if (called)  {
                        return;
                    }
                    called = true;
                    resolvePromise(promise2, res,  resolve, reject);
                }, (res) => {
                    if (called) return;
                    called = true;
                    reject(res);
                })
            } else {
                resolve(x);
            }

        } catch (error) {
            if (called) return;
            called = true;
            reject(called); 
        }
    } else {
        resolve(x);
    }
};