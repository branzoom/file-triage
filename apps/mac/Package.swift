// swift-tools-version: 6.0

import PackageDescription

let package = Package(
    name: "FileTriage",
    platforms: [
        .macOS(.v13)
    ],
    products: [
        .executable(name: "FileTriage", targets: ["FileTriage"])
    ],
    targets: [
        .executableTarget(
            name: "FileTriage",
            linkerSettings: [
                .linkedFramework("AppKit"),
                .linkedFramework("Quartz"),
                .linkedFramework("QuickLook")
            ]
        )
    ]
)
