rm *.js
rm cssfiles.txt
cp -r dist/vial-rack/* .
git add -A
git commit -m "distmv"
git checkout master