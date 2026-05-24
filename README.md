# Leo Chui Property Website

Personal real estate advertising website for curated Hong Kong luxury property listings.

## Current listing

- Property reference: MMQ883
- District: Ho Man Tin / Kowloon
- Listing type: Sale
- Gallery: 8 converted JPEG images from the MMQ883 Google Drive upload set

## Structure

- `index.html` - main static website
- `css/style.css` - website styling
- `js/app.js` - frontend interactions and listing modal
- `js/listings.js` - listing data reader
- `data/listings.json` - manual listing control file
- `assets/` - website images and icons
- `assets/properties/S01` to `assets/properties/S20` - sale listing image folders
- `assets/properties/R01` to `assets/properties/R20` - rental listing image folders

## Notes

This repository contains the public website-ready copy. Private Google Drive source links are not included in this public repository.

## Manual upload workflow

1. Edit `data/listings.json`.
2. Use `S01` to `S20` for sale listings and `R01` to `R20` for rental listings.
3. Set `visibility` to `show` when a listing should appear, or `hide` when it should be hidden.
4. Set `listing_status` to `available`, `sold`, or `rented`.
5. Upload photos into the matching folder, for example `assets/properties/S01/`.
6. Use JPG image names `01.jpg` to `08.jpg`. The first image is the main photo.
7. Do not upload HEIC directly for the public website. Convert HEIC photos to JPG before uploading.
8. Add YouTube, Google Maps, and VR iframe embed code into `youtube_embed`, `google_maps_embed`, and `vr_embed` when available.
