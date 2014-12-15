FROM node:0.10-onbuild

# Install bower and bower components
RUN npm install -g bower \
    && npm cache clear
RUN bower install --config.interactive=false --allow-root

EXPOSE 8080
