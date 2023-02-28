from subprocess import Popen, PIPE

p = Popen(['git', 'branch'], stdin=PIPE, stdout=PIPE, stderr=PIPE)
output, err = p.communicate(b"input data that is passed to subprocess' stdin")
rc = p.returncode
# subprocess.call(['bash','deploy.sh'])
# with open('cssfiles.txt','r') as f:
#     ctnt = f.read().splitlines()
#     ctnt.pop()
# for fpath in ctnt:
#     with open(f'src/{fpath}','w+') as f:
#         styles = f.read()
#         styles = styles.replace('/assets/','/VialRack/assets/')
#         f.write(styles)
