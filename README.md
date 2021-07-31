# js hook

a simple javascript hook/decorate library.

## usage

```shell script
    npm install @xesam/hook
```

## methods 

```javascript
    const {decorate, hook} = require('@xesam/hook');
    decorate; //decorate a function,and get a new function
    hook; //hook a object's functional attribute
```

### decorate function with another function

```javascript
    const {decorate} = require('@xesam/hook');
    function fn() {
      console.log('fn');
    }
    const decorated = decorate(fn, function(srcFn) {
        console.log('before');
        srcFn();
        console.log('after');
    });
    decorated();
```

output:

```text
    before
    fn
    after
```

### decorate function with map config

```javascript
    const {decorate} = require('@xesam/hook');
    function fn() {
      console.log('fn');
    }
    const decorated = decorate(fn, {
        before() {
            console.log('before');
        },
        after() {
            console.log('after');
        }
    });
    decorated();
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
       before() {
           console.log('before');
       },
       after() {
           console.log('after');
       }
   });
   hook1.onLoad();
   
   const hook2 = hook(target, 'methods.onTap', {
       before() {
           console.log('before');
       },
       after() {
           console.log('after');
       }
   });
   hook2.methods.onTap();
   
   const hook3 = hook(target, ['onLoad', 'onShow'], {
       before() {
           console.log('before');
       },
       after() {
           console.log('after');
       }
   });
   hook3.onLoad();
   
   const hook4 = hook(target, {
       onLoad() {
           return {
               before() {
                   console.log('before');
               },
               after() {
                   console.log('after');
               }
           };
       },
       onShow() {
           return {
               before() {
                   console.log('before');
               },
               after() {
                   console.log('after');
               }
           };
       }
   });
   hook4.onLoad();
```