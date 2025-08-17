Get-ChildItem _posts -Filter *.md | 
Foreach-Object {
    m2j -c $_.FullName >> _drafts\ia\$_.Name.json
}
