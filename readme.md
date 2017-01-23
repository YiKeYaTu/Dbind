# 简介

- 简易自适应移动端(根据screen.availWidth对比视觉稿宽度进行缩放)

# 用例

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
            app.set('msg', this.msg.split('').reverse().join(''));
        }
    });

````

- 这里的msg将会与app中的第二个参数进行绑定
- 当对app进行set操作的时候将会触发dom的更新

# 指令

- ob.js提供了data-each, data-if, data-else, data-else-if, data-html几种指令

````html
    <body>
        <div data-if="index > 1" data-each="value, index in arr" onclick="{{ pushItem() }}">
            {{ value }}
        </div>
    </body>
````

````javascript
    var app = Observer.watch(document.getElementsByTagName('div')[0], {
        arr: [1, 3, 5]
        pushItem: function() {
            var arr = this.arr.concat(1);
            app.set('arr', arr);
        }
    });

````


# 事件

- 当dom中绑定的事件带有插值表达式的时候，ob.js将会对此事件进行处理

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

````javascript
    var component = Observer.createComponent({
        template: '<div>{{ name }}</div>'
    });
    Observer.registerComponent('frist-component', component);

````

    