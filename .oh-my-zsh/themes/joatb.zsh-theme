current_time() {
   echo "%{$fg[white]%}%*%{$reset_color%}"
}

PROMPT='[%{$fg_bold[white]%}%n%{$reset_color%}@%{$fg_bold[cyan]%}%m%{$reset_color%} %{$fg[cyan]%}%c%{$reset_color%} $(git_prompt_info)%{$reset_color%}]$ '

ZSH_THEME_GIT_PROMPT_PREFIX="(%{$fg_bold[green]%}"
ZSH_THEME_GIT_PROMPT_SUFFIX=")"
ZSH_THEME_GIT_PROMPT_DIRTY="%{$fg[green]%} %{$fg[yellow]%}✗%{$reset_color%}"
ZSH_THEME_GIT_PROMPT_CLEAN="%{$reset_color%}"

RPROMPT='$(current_time) '%(?.%{$fg_bold[cyan]%}✔%{$reset_color%}.%{$fg[red]%}✘%f)''
