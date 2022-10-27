# @xesam/hook

a simple javascript decorate/hook library.

## usage

```shell script
    npm install @xesam/hook
```

## methods 

```javascript
    const {decorate, hook} = require('@xesam/hook');
    decorate(...); //decorate a function, and get a new function
    hook(...); //hook a object's functional attribute
```

### decorate function with another function

```javascript
    const {decorate} = require('@xesam/hook');
    function fn() {
        console.log('fn');
        return 'a';
    }
    const decorated = decorate(fn, function(srcFn) {
        console.log('before');
        const ret = srcFn();
        console.log('after');
        return ret;
    });
    decorated();
```

output:

```text
    before
    fn
    after
```

### decorate function with object

```javascript
    const {decorate} = require('@xesam/hook');
    function fn(a, b) {
        console.log('fn');
        return a + b;
    }
    const decorated = decorate(fn, {
        before(a, b) {
            console.log('before');
        },
        afterReturn(result, a, b) { // result = fn(100, 200)
            console.log('after');
            return result;
        },
        after(result, error, a, b) { 
            console.log('after');
            return res;
        }
    });
    decorated(100, 200);
```

output:

```text
    before
    fn
    after
```

### hook object attr

```javascript
    const {hook} = require('@xesam/hook');
   const target = {
       data: {
           name: 'hook'
       },
       onLoad(query) {
           console.log('onLoad', this.data.name);
       },
       onShow() {
       },
       methods: {
           onTap() {
           }
       }
   };
   const hook1 = hook(target, 'onLoad', {
       before(query) {
           console.log('before');
       },
       afterReturn(res, query) {
           console.log('after');
           return res;
       }
   });
   hook1.onLoad();
   
   const hook2 = hook(target, 'methods.onTap', {
       before(query) {
           console.log('before');
       },
       afterReturn(res, query) {
           console.log('after');
           return res;
       }
   });
   hook2.methods.onTap();
   
   const hook3 = hook(target, ['onLoad', 'onShow'], {
       before(query) {
           console.log('before');
       },
       afterReturn(res, query) {
           console.log('after');
           return res;
       }
   });
   hook3.onLoad();
   
   const hook4 = hook(target, {
       onLoad(host) {
           return {
               before(query) {
                   console.log('before');
               },
               afterReturn(res, query) {
                   console.log('after');
                   return res;
               }
           };
       },
       onShow(host) {
           return {
               before() {
                   console.log('before');
               },
               afterReturn(res) {
                   console.log('after');
                   return res;
               }
           };
       }
   });
   hook4.onLoad();
```

### ChangeLogs

#### 0.1.7

1. todo

#### 0.1.6

1. add afterReturn config.