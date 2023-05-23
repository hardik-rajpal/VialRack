ng build --base-href https://hardik-rajpal.github.io/ISID-EPU/;
bash -c 'mv dist/vial-rack/* .';
bash -c 'cp index.html 404.html; rm -rf assets; cp -r src/assets assets';
git add -A;
$msg = bash -c "git log -2 --pretty=%B | sed -n '3 p'"
git commit -m "$msg";
git push origin deploy --force;
git checkout master;