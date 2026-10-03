import Foundation
import AVFoundation
import AppKit

let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let directory = root.appendingPathComponent("apps/foundingos-web/public/media/marketing-library")
let frames: [(String, Double)] = [
    ("FoundingOS-Social-Product-Photo", 5),
    ("FoundingOS-Social-WhatsApp-to-Work", 5),
    ("FoundingOS-Social-Business-in-Your-Pocket", 5),
    ("FoundingOS-Customer-Introduction", 8),
    ("FoundingOS-Legal-16x9", 8),
    ("FoundingOS-Legal-9x16", 8),
    ("FoundingOS-Logistics-16x9", 8),
]

for (name, seconds) in frames {
    let asset = AVURLAsset(url: directory.appendingPathComponent("\(name).mp4"))
    let generator = AVAssetImageGenerator(asset: asset)
    generator.appliesPreferredTrackTransform = true
    generator.requestedTimeToleranceBefore = .zero
    generator.requestedTimeToleranceAfter = .zero
    let (image, _) = try await generator.image(at: CMTime(seconds: seconds, preferredTimescale: 600))
    let bitmap = NSBitmapImageRep(cgImage: image)
    guard let data = bitmap.representation(using: .jpeg, properties: [.compressionFactor: 0.9]) else {
        throw NSError(domain: "MarketingStills", code: 1, userInfo: [NSLocalizedDescriptionKey: "Could not encode \(name)"])
    }
    try data.write(to: directory.appendingPathComponent("\(name).jpg"))
    print("\(name).jpg: \(image.width)x\(image.height) at \(seconds)s")
}
