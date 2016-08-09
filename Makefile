branch = master

default:
	@echo "Use 'make subtree-update' to update all subtrees"

check-vars:
	@test -n "$(prefix)" || (echo >&2 "prefix is not set"; false)
	@test -n "$(url)" || (echo >&2 "url is not set"; false)
	@test -n "$(branch)" || (echo >&2 "branch is not set"; false)

subtree-add: check-vars
	git subtree add --prefix $(prefix) $(url) $(branch) --squash

subtree-pull: check-vars
	git subtree pull --prefix $(prefix) $(url) $(branch) --squash

subtree-update: \
subtree-pull-object-values-entries \
subtree-pull-sat-js

subtree-pull-object-values-entries:
	$(MAKE) subtree-pull prefix=shims/object-values-entries url=https://github.com/tc39/proposal-object-values-entries

subtree-pull-sat-js:
	$(MAKE) subtree-pull prefix=sat-js url=https://github.com/jriecken/sat-js