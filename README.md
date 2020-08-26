# js tiny hook

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
    hooked();
```

output:

```text
before 100
onLoad hook
after 100
```