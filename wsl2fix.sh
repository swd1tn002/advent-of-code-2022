# Until day 3, working in VS Code dev container was extremely slow due to WSL2 and NTFS issues.
# See https://github.com/microsoft/WSL/issues/4197 / https://github.com/microsoft/WSL/issues/4515.
# This fixes the issue temporarily by moving node_modules outside of the NTFS volume and adding a symbolic link.
npm install &&
mv node_modules $HOME/ &&
ln -s $HOME/node_modules node_modules