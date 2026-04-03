from PIL import Image, ImageDraw, ImageFont
from datetime import datetime

def geo_stamp(
    image_path,
    lat,
    lon,
    output_path,
    address=None
):
    img = Image.open(image_path).convert("RGBA")

    # Create overlay for transparency
    overlay = Image.new("RGBA", img.size, (255, 255, 255, 0))
    draw_overlay = ImageDraw.Draw(overlay)

    draw = ImageDraw.Draw(img)

    # Stamp text
    timestamp = datetime.now().strftime("%d %b %Y | %I:%M %p")

    lines = [
        f"Lat: {lat:.6f}, Lon: {lon:.6f}",
        f"{timestamp}"
    ]

    if address:
        lines.insert(0, address)

    text = "\n".join(lines)

    # Font (fallback safe)
    try:
        font = ImageFont.truetype("arial.ttf", 28)
    except:
        font = ImageFont.load_default()

    padding = 12
    bbox = draw.multiline_textbbox((0, 0), text, font=font)

    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]

    x = padding
    y = img.height - text_h - padding

    # ✅ Soft transparent background (NO outline)
    draw_overlay.rectangle(
        [(x - 12, y - 12), (x + text_w + 12, y + text_h + 12)],
        fill=(0, 0, 0, 110)  # adjust alpha: 80–120 is ideal
    )

    # Merge overlay with image
    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)

    # Draw text
    draw.multiline_text((x, y), text, fill="white", font=font)

    img.convert("RGB").save(output_path, quality=95)


# ---- RUN ----
geo_stamp(
    image_path="input.jpeg",
    lat=18.520430,
    lon=73.856743,
    output_path="stamped_photo.jpg",
    address="📍 Construction Site A"
)
