# Adding Your Own Images to the Project

## Where to Place Images

### Public Folder (Recommended for Static Assets)
Place your images in the `public` folder at the root of your project:

```
project-root/
├── public/
│   ├── volleyball-court-default.jpg     # Current default image
│   ├── your-custom-court.jpg            # Your new image
│   ├── another-court.png                # Another image
│   └── images/                          # Optional subfolder
│       ├── court-indoor.jpg
│       └── court-outdoor.jpg
├── src/
└── package.json
```

### How to Reference Images

#### From Public Folder (Static URLs)
```typescript
// Direct reference (image in public folder)
const imageUrl = '/your-custom-court.jpg';

// With subfolder
const imageUrl = '/images/court-indoor.jpg';

// In JSX
<img src="/your-custom-court.jpg" alt="Custom court" />
```

#### From Src Folder (Imported Assets)
```typescript
// Place in src/assets/images/
import courtImage from '../assets/images/court.jpg';

// Use in JSX
<img src={courtImage} alt="Court" />
```

## Supported Image Formats
- **JPEG** (.jpg, .jpeg) - Best for photos
- **PNG** (.png) - Best for images with transparency
- **WebP** (.webp) - Modern format, smaller file sizes
- **SVG** (.svg) - Vector graphics

## File Size Recommendations
- **Web optimization**: Keep under 1MB for faster loading
- **High quality**: 2-5MB acceptable for detailed analysis
- **Maximum**: 10MB (current app limit)

## Image Optimization Tips
1. **Resize** images to reasonable dimensions (1920x1080 max recommended)
2. **Compress** using tools like TinyPNG or built-in compression
3. **Choose format** based on content:
   - JPEG for photographs
   - PNG for graphics with transparency
   - WebP for best compression

## Adding Multiple Default Images

You can add multiple default images and create a selection interface:

```typescript
// In your component
const defaultImages = [
  {
    name: 'Professional Court',
    url: '/volleyball-court-default.jpg',
    description: 'Standard professional volleyball court'
  },
  {
    name: 'Indoor Court',
    url: '/images/court-indoor.jpg',
    description: 'Indoor gymnasium court'
  },
  {
    name: 'Beach Court',
    url: '/images/court-beach.jpg',
    description: 'Beach volleyball court'
  }
];
```

## Quick Steps to Add Your Image

1. **Copy your image file** to the `public` folder
2. **Rename if needed** (use descriptive names, no spaces)
3. **Update the code** to reference your image:
   ```typescript
   const YOUR_IMAGE_URL = '/your-image-name.jpg';
   ```
4. **Test the image** loads by visiting: `http://localhost:5173/your-image-name.jpg`

## Example: Adding a Custom Default Image

If you want to replace the current default image:

1. Add your image to `public/my-volleyball-court.jpg`
2. Update the constant in your code:
   ```typescript
   const DEFAULT_COURT_IMAGE_URL = '/my-volleyball-court.jpg';
   ```

That's it! The image will be available immediately without needing to restart the dev server.
