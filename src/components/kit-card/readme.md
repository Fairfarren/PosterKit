# kit-card

<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type                                                                                                                                                                                                                                                                        | Default     |
| -------- | --------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `data`   | `data`    |             | `BaseOptions & { type: "image"; image: HTMLImageElement; } \| BaseOptions & { type: "text"; text: string; fontSize: number; fontFamily: string; color: string; fontWeight: string; fontStyle: "normal" \| "italic"; decoration: "none" \| "underline" \| "line-through"; }` | `undefined` |
| `zoom`   | `zoom`    |             | `number`                                                                                                                                                                                                                                                                    | `1`         |


## Dependencies

### Used by

 - [kit-box](../kit-box)

### Depends on

- [kit-svg](../kit-svg)

### Graph
```mermaid
graph TD;
  kit-card --> kit-svg
  kit-box --> kit-card
  style kit-card fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
