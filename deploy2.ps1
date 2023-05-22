git add -A;
$msg = bash -c "git log -2 --pretty=%B | sed -n '3 p'"
git commit -m "$msg";
git push origin deploy --force;
git checkout master;