# Define the root directory to start the search
$rootDir = "."

# Get all directories recursively, excluding the node_modules directory
$directories = Get-ChildItem -Path $rootDir -Recurse -Directory | Where-Object { $_.FullName -notmatch "\\node_modules\\" }

foreach ($dir in $directories) {
    Write-Host "Pasta encontrada: $($dir.FullName)"
    Read-Host -Prompt "Pressione Enter para listar os arquivos e exibir o conteúdo"

    # Get all files in the current directory
    $files = Get-ChildItem -Path $dir.FullName -File

    foreach ($file in $files) {
        Write-Host "Conteúdo do arquivo: $($file.FullName)"
        Get-Content -Path $file.FullName
        Write-Host "`n"  # Add a newline for better readability
    }
}