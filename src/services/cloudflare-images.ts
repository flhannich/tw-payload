// services/cloudflare-images.ts
// Cloudflare Images processing using direct Worker binding

interface ImageSize {
    name: string
    width: number
    quality: number
}

export const IMAGE_SIZES: ImageSize[] = [
    { name: 'xs', width: 400, quality: 60 },
    { name: 's', width: 600, quality: 60 },
    { name: 'm', width: 800, quality: 60 },
    { name: 'l', width: 1200, quality: 60 },
    { name: 'xl', width: 1600, quality: 60 },
]

export async function processImageWithCloudflare(
    imageBuffer: ArrayBuffer,
    cloudflareEnv: any
): Promise<{ [key: string]: ArrayBuffer }> {
    const results: { [key: string]: ArrayBuffer } = {}

    try {
        // Check if Images binding is available
        if (!cloudflareEnv.IMAGES) {
            console.warn('Cloudflare Images binding not available, skipping image processing')
            return results
        }

        // Convert ArrayBuffer to ReadableStream
        const stream = new ReadableStream({
            start(controller) {
                controller.enqueue(new Uint8Array(imageBuffer))
                controller.close()
            },
        })

        // Process each size using direct Images API
        for (const size of IMAGE_SIZES) {
            try {
                // Transform image using Cloudflare Images binding
                const transformedImage = await cloudflareEnv.IMAGES.input(stream.tee()[0]) // tee() creates independent streams
                    .transform({
                        width: size.width,
                        quality: size.quality,
                    })
                    .output({ format: 'webp' })

                // Get the response and convert to ArrayBuffer
                const response = transformedImage.response()
                if (response.ok) {
                    results[size.name] = await response.arrayBuffer()
                }
            } catch (error) {
                console.warn(`Failed to process size ${size.name}:`, error)
            }
        }
    } catch (error) {
        console.error('Image processing failed:', error)
    }

    return results
}
