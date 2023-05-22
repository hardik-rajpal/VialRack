bash -c 'rm -rf .angular node_modules/.cache dist'
git checkout deploy
git merge master
bash -c 'rm main.*.js polyfills.*.js runtime.*.js styles.*.css index.html'    
