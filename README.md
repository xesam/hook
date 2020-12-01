# js tiny hook

## usage
### install

```shell script
    npm install @xesam/hook
```

### hook a simple function

```javascript
    function fn() {
      console.log('fn');
    }
    const hooked = hook(fn, {
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

### hook object method

```javascript
    const target = {
        data: {
            name: 'hook'
        },
        onLoad(query) {
            console.log('onLoad', this.data.name);
        },
        onShow() {
        }
    };

    const hooked = hook(target, {
        onLoad() {
            const id = 100;
            return {
                before() {
                    console.log('before', id);
                },
                after() {
                    console.log('after', id);
                }
            };
        }
    });
    hooked.onLoad();
```

output:

```text
before 100
onLoad hook
after 100
```

### make a function hookable

    hookable = hook.hookable(fn)
    hookable.add(hook1);
    hookable.add(hook2);
    hookable(opts);
    
equals:
    
    fn(hook(hook(opts, hook1), hook2))    



```javascript
    const target = {
        data: {
            name: 'target_name'
        },
        onLoad(query) {
            console.log('onLoad', this.data.name);
        }
    };

    const hookable = hook.hookable(target);
    
    hookable.add({
         onLoad() {
             const id = 100;
             return {
                 before() {
                     console.log('before', id);
                 }
             };
         }
     }).add({
        onLoad() {
            const id = 200;
            return {
                before() {
                    console.log('before', id);
                }
            };
        }
    });

    hookable.onLoad();
```

output:

```text
before 200
before 100
onLoad target_name
```

