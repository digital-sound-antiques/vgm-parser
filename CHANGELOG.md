# v0.10.0
- Changed gzip library from zlibjs to fflate.
- Upgraded npm dependencies.
- Changed minimum node requirement version to 18.

# v0.9.5
- Prevent crashes when GD3 tag is malformed.

# v0.9.4
- Fix the crash problem if data offset is not specified in VGM header.

# v0.9.3
- Support VGM v1.51 file that contains legacy data offset 0x40.
- Fix the problem where the parser crashes when .vgm created with Snooze Tracker.

# v0.9.0
- Add setter function for extra headers.

# v0.8.6
- Add vgm header validation.
- Resolve reference error of TextDecoder on browser.
- npm audit fix

# v0.8.3
- Support building VGM files version less than 1.71.
- Adjust offsets in header before build.

# v0.8.2
- Support building compressed (.vgz) file.

# v0.8.0
- Support browser.
- Support extra header.
- Add copy method to VGMCommand.
- Subclassing VGMWaitCommand.
- Decompress .vgz file internally.

# v0.6.1
- Fix the bug where SN76489 is recognized as T6W28.

# v0.6.0
- Add VGM builder.
- Refactor and add tests.