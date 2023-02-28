cd src
for fn in $(tree | pcregrep -o1  ".*\s(.*.css)")
do
find . -name $fn
done > ../cssfiles.txt