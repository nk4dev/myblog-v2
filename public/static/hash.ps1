(Get-FileHash $args[0] -Algorithm sha256).hash.ToLower()
