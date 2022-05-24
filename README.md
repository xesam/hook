# js hook

a simple javascript hook/decorate library.

## usage

```shell script
    npm install @xesam/hook
```

## methods 

```javascript
    const {decorate, hook} = require('@xesam/hook');
    decorate(...); //decorate a function,and get a new function
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
        after(res, a, b) { // res = fn(100, 200)
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
       after(res, query) {
           console.log('after');
           return res;
       }
   });
   hook1.onLoad();
   
   const hook2 = hook(target, 'methods.onTap', {
       before(query) {
           console.log('before');
       },
       after(res, query) {
           console.log('after');
           return res;
       }
   });
   hook2.methods.onTap();
   
   const hook3 = hook(target, ['onLoad', 'onShow'], {
       before(query) {
           console.log('before');
       },
       after(res, query) {
           console.log('after');
           return res;
       }
   });
   hook3.onLoad();
   
   const hook4 = hook(target, {
       onLoad() {
           return {
               before(query) {
                   console.log('before');
               },
               after(res, query) {
                   console.log('after');
           return res;
               }
           };
       },
       onShow() {
           return {
               before() {
                   console.log('before');
               },
               after(res) {
                   console.log('after');
                   return res;
               }
           };
       }
   });
   hook4.onLoad();
```