# Define the source directory
$sourceDir = "../.."
$srcDir = "../../src"

# Get all files in the root directory, excluding package-lock.json
$rootFilesToWrite = Get-ChildItem -Path $sourceDir -File | Where-Object { $_.Name -ne "package-lock.json" }

# Get all files in the src directory
$srcFilesToWrite = Get-ChildItem -Path $srcDir -File -Recurse

# Write the contents of the files from the root directory to the console
Write-Host "Conteúdos dos arquivos na raiz (exceto package-lock.json):"
foreach ($file in $rootFilesToWrite) {
    Write-Host "Conteúdo do arquivo: $($file.Name)"
    Get-Content -Path $file.FullName
    Write-Host "`n"  # Add a newline for better readability
}

# Write the contents of the files from the src directory to the console
Write-Host "`nConteúdos dos arquivos no diretório src e seus subdiretórios:"
foreach ($file in $srcFilesToWrite) {
    Write-Host "Conteúdo do arquivo: $($file.FullName)"
    Get-Content -Path $file.FullName
    Write-Host "`n"  # Add a newline for better readability
}