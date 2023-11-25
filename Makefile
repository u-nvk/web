build_docker_latest_dev:
	npm run build
	docker image build --platform linux/amd64 -t ermolaev10/unvk-web:latest-dev .

build_docker_latest_dev_and_push:
	make build_docker_latest_dev
	docker push ermolaev10/unvk-web:latest-dev