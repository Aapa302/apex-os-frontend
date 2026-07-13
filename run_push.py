import subprocess
res = subprocess.run(["git", "push", "origin", "main", "--dry-run"], capture_output=True, text=True)
print("STDOUT:", res.stdout)
print("STDERR:", res.stderr)
print("RC:", res.returncode)
