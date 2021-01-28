# js hook

a simple javascript hook/decorate library.

## usage

### add dependency

```json
    {
        "hook": "git+ssh://git@github.com:xesam/miniapp-router.git"
    }
```

### decorate function with function

```javascript
    function fn() {
      console.log('fn');
    }
    const decorated = decorate(fn, function(srcFn) {
        console.log('before');
        srcFn();
        console.log('after');
    });
```

output:

```text
    before
    fn
    after
```

### decorate function with param

```javascript
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
```

output:

```text
    before
    fn
    after
```

### hook object

```javascript
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
   hook1();
   
   const hook2 = hook(target, 'methods.onTap', {
       before() {
           console.log('before');
       },
       after() {
           console.log('after');
       }
   });
   hook2();
   
   const hook3 = hook(target, ['onLoad', 'onShow'], {
       before() {
           console.log('before');
       },
       after() {
           console.log('after');
       }
   });
   hook3();
   
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
   hook4();
```