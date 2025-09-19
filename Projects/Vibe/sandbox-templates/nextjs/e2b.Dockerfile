FROM e2b/node-npm

# Install curl for health checks
RUN sudo apt-get update && sudo apt-get install -y curl

# Copy the startup script and make it executable
COPY ./compile_page.sh /home/user/compile_page.sh
RUN sudo chmod +x /home/user/compile_page.sh

# Set working directory for the Next.js app
WORKDIR /home/user/nextjs-app

# Install Next.js and shadcn/ui with specific versions
# Use --yes to auto-confirm any prompts
RUN npm_config_yes=true npx --yes create-next-app@15.0.0-rc.0 . --ts --tailwind --eslint --app --src-dir --import-alias="@/*"
RUN npm_config_yes=true npx --yes shadcn-ui@latest init
RUN npm_config_yes=true npx --yes shadcn-ui@latest add --all

# Move app contents to the root user directory and clean up
WORKDIR /home/user
RUN mv /home/user/nextjs-app/* /home/user/ && \
    mv /home/user/nextjs-app/.* /home/user/ && \
    rm -rf /home/user/nextjs-app