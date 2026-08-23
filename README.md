# MNRuntimeLib
![Stable](https://img.shields.io/badge/Status-Stable-0d47a1?style=flat&labelColor=2E72E7)

一个面向MarginNote插件开发的基础库仓库，提供MarginNote对象封装、运行时接入能力以及一组可复用的通用工具。

本项目是在Feliks的MNUtils代码基础上做裁剪、拆分和重组后形成的纯基础层版本，定位为MarginNote插件开发的基础lib。

## Features

- MarginNote对象封装
  包括笔记、评论、文档、笔记本等常见对象的统一访问能力。
- Runtime基础设施
  提供生命周期分发、广播路由注册、资源路径解析和基础WebView壳。
- 通用工具函数
  包含文件读写、URL处理、JSON修复、Markdown转换、压缩解压、图片与PDF转换等底层能力。
- 可复用资源与页面
  内置语言包、JSON Editor页面和所需静态资源，方便插件快速接入。

## Core APIs

### Runtime

运行时核心入口，主要用于注册生命周期和处理插件内路由。

```js
Runtime.registerLifecycle({
  sceneWillConnect() {
    MNUtil.showHUD("Runtime loaded")
  }
})
```

```js
Runtime.registerRoute("ping", () => {
  MNUtil.showHUD("pong")
})
```

### MNUtil

通用工具入口，包含处理文件、资源、窗口、URL和WebView等诸多工具。

```js
let path = Runtime.assets.resolve("assets/dot.png")
let webview = MNUtil.createJsonEditor()
webview.frame = MNUtil.genFrame(20, 80, 800, 600)
MNUtil.studyView.addSubview(webview)
```

### MNNote

MarginNote对象封装入口。

```js
let note = MNNote.new("note-id")
```

## Fork Experience Notes

### MarginNote 4 JSB helper dispatch

Verified on MarginNote 4: AddonLib's `MNUtil.userInput` can present the native
text-input dialog from a mounted study window. The wrapper itself is not the
failure point when a host add-on toolbar action opens no UI.

The observed host-side failure pattern is declaring ordinary JavaScript helper
methods inside the object passed to `JSB.defineClass` and then calling them as
`this.helper()` or `self.helper()` from lifecycle callbacks or Objective-C
selectors. On this runtime, lifecycle callbacks and registered selectors are
reachable, but those ordinary helpers are not necessarily exposed as instance
methods. A failing call may therefore terminate before AddonLib displays its
input dialog.

Host add-ons should use either of these patterns:

- Keep plain helper workflows as top-level functions and pass the add-on
  instance explicitly, for example `openPairingIfNeeded(addon)`.
- Or assign helpers to the returned class prototype after `JSB.defineClass`
  returns, following the established MarginNote add-on pattern.

This is integration guidance for host add-ons. No AddonLib API change or
upstream issue/PR is required.

## License Statement

本项目相关代码已获得授权，并以MIT License发布。

任何人可以在遵守MIT协议的前提下自由使用、修改、分发和复用本仓库中的代码。

具体许可条款请见[LICENSE](/Users/shenshichao/Downloads/mnutils_v0_2_2_alpha0228/LICENSE)。
