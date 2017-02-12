# 简介

- 前端mvvm组件化框架

# 开始

- 引入index.js

````html
    <body>
        <div onclick="{{ reverseMsg() }}">
            {{ msg }}
        </div>
    </body>
````

````javascript
    var app = Observer.watch(document.getElementsByTagName('div')[0], {
        msg: 'hello world',
        reverseMsg: function() {
            app.watcher.trackingUpdate(() => {}, 'msg', this.msg.split('').reverse().join(''));
        }
    });

````

- 这里的msg将会与app中的第二个对象中的msg参数进行绑定
- 当对app进行trackingUpdate操作的时候将会触发dom的更新

# 性能

- 该框架并没有用到虚拟dom来优化性能，而是使用了不同的思想来减少dom的操作
- Observer的watch方法在首次载入时会遍历传入的dom，并为每一个dom节点绑定一个watcher
- 每个watcher会提取出该dom的model，例如

````html
    <div data-if="a > b"></div>
````

- 这里会提取出a，b并且分别以a，b为键将该watcher的reset方法放入一个全局的对象当中
- 当触发trackingUpdate方法的时候，watcher将会取出重设的键的所有reset函数并且一一执行

# 指令

- data-if data-else data-else-if（控制dom的显示与隐藏，当求值为假的时候该watcher不会继续遍历该dom的子元素）

````html
    <body>
        <div data-if="count > 1">
            hello world
        </div>
    </body>
````

````javascript
    var app = Observer.watch(document.getElementsByTagName('div')[0], {
        count: 2
    });

````

- data-each（循环dom结构，对象可以是普通键值对象或者数组）

````html
    <body>
        <div data-each="i in array">
            {{ array[i] }}
        </div>
    </body>
````

````javascript
    var app = Observer.watch(document.getElementsByTagName('div')[0], {
        array: [1, 3, 5]
    });

````
- data-html（使该dom的子元素以innerHTML的形式插入）

````html
    <body>
        <div data-html>
            {{ html }}
        </div>
    </body>
````

````javascript
    var app = Observer.watch(document.getElementsByTagName('div')[0], {
        html: '<p>hello world</p>'
    });

````


# 事件

- 当dom中绑定的事件带有插值表达式的时候，ob.js将会对此事件进行处理(可以传入原生$event对象)

````html
    <body>
        <div onclick="{{ handle($event) }}">
            {{ value }}
        </div>
    </body>
````

````javascript
    var app = Observer.watch(document.getElementsByTagName('div')[0], {
        value: 100,
        handle: function($event) {
            //
        }
    });

````

# 组件

- 创建一个组件

````javascript
    var component = Observer.createComponent({
        template: '<div>{{ name }}</div>'
    });
    Observer.registerComponent('App', component);

````

- 注册一个组件（组件只有被注册之后才能在html里面直接使用）

````javascript
    Observer.registerComponent('App', component);
````
- 使用组件（因为data-from为一个指令，将会直接当作javascript解析所以要想使用字符串必须加上引号）
- data-from指令不仅可以传入一个组件的注册名字还能直接穿入一个组件

````html
    <body>
        <component data-from="'App'"></component>
    </body>
````

- 在组件之中使用组件

````javascript
    var button = Observer.createComponent({
        template: `<button>button</button>`
    })
    var component = Observer.createComponent({
        template: `<div>
            <component data-from="'button'"></component>
        </div>`,
        components: {
            button: button
        }
    });

````

- 组件拥有单独的作用域，如果想要向组件传递消息请使用props

````javascript
    var button = Observer.createComponent({
        template: `<button>{{ val }}</button>`
    })
    var component = Observer.createComponent({
        data: {
            val: 'im is a button'
        },
        template: `<div>
            <component val="{{ val }}" data-from="'button'"></component>
        </div>`,
        components: {
            button: button
        }
    });

````

- 组件生命周期方法
````javascript
    var component = Observer.createComponent({
        didMount() { // 组件完成渲染
            console.log(this.refs.ul);
        },
        willMount() { // 组件即将完成渲染

        },
        willUpdate(prev, next) { // 组件即将更新

        },
        shouldUpdate(prev, next) { // 组件是否应该更新

        },
        template: `<div>
            <ul ref="ul">
            </ul>
        </div>`
    });

````


    