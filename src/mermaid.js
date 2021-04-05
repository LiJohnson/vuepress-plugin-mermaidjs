import Loading from './Loading.vue'

const Mermaid = {
    name: 'Mermaid',
    props: {
        id: {
            type: String,
            required: true
        },
        graph: {
            type: String,
            required: true
        },
    },
    data () {
        return {
            svg: undefined,
            show: true,
        }
    },
    render (h) {
        if (this.svg === undefined) {
            return h('Loading')
        }
        let _this = this;
        return h("div", {
            style: {
                position: 'relative'
            }
        }, [
            h('div', {
                style: {
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    zIndex: 999,
                }
            }, [
                h('a', {
                    style: {
                        margin: '5px'
                    },
                    attrs: {
                        href: "javascript:;"
                    },
                    on: {
                        click() {
                            _this.show = !_this.show
                        }
                    }
                }, '🔁'),
                h('a', {
                    style: {
                        margin: '5px'
                    },
                    attrs: {
                        href: URL.createObjectURL(new Blob([_this.svg], { type: 'image/svg+xml' })),
                        target: "_blank"
                    },
                }, '🔗'),
            ]),
            h('div', {
                domProps: {
                    innerHTML: this.svg,
                    style: 'width: 100%'
                },
                directives: [{
                    name: "show",
                    value: this.show
                }]

            }),
            h('div', {
                'class': ['language-mermaid', 'extra-class'],
                domProps: {
                    innerHTML: `<pre class="language-text"><code>${this.graph}
                    </code></pre>`
                },
                directives: [{
                    name: "show",
                    value: !this.show
                }]
            })
        ])
    },
    mounted () {
        import('mermaid/dist/mermaid.min').then(mermaid => {
            mermaid.initialize({ startOnLoad: true, ...MERMAID_OPTIONS })

            let renderDiv = document.createElement('div')
            document.body.appendChild(renderDiv)

            mermaid.render(
                this.id,
                this.graph,
                (svg) => {
                    this.svg = svg
                    document.body.removeChild(renderDiv)
                },
                renderDiv
            )
        })
    },
    components: {
        Loading
    }
}

export default ({ Vue }) => {
    Vue.component('Mermaid', Mermaid)
}
