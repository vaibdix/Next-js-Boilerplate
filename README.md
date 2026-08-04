# Boilerplate and Starter for Next.js 16+, Tailwind CSS 4, and TypeScript.

### Features

Developer experience first, extremely flexible code structure and only keep what you need:

- ⚡ [Next.js](https://nextjs.org) with App Router support
- 🔥 Type checking [TypeScript](https://www.typescriptlang.org)
- 💎 Integrate with [Tailwind CSS](https://tailwindcss.com)
- 🤖 AI coding agent instructions for Claude Code, Codex, Cursor, OpenCode, Copilot, and more
- ✅ Strict Mode for TypeScript and React 19
- 🔒 Authentication with [Clerk](https://clerk.com?utm_source=github&utm_medium=sponsorship&utm_campaign=nextjs-boilerplate): Sign up, Sign in, Sign out, Forgot password, Reset password, and more.
- 👤 Passwordless Authentication with Magic Links, Multi-Factor Auth (MFA), Social Auth (Google, Facebook, Twitter, GitHub, Apple, and more), Passwordless login with Passkeys, User Impersonation
- 🌐 Multi-language (i18n) with next-intl and [Crowdin](https://l.crowdin.com/next-js)
- ♻️ Type-safe environment variables with T3 Env
- ⌨️ Form handling with React Hook Form
- 🔴 Validation library with Zod
- 📏 Linter with Oxlint with Ultracite preset
- 💖 Code Formatter with Oxfmt
- 🦊 Lefthook for Git Hooks
- 🚓 Lint git commit with Commitlint
- 📓 Write standard compliant commit messages with Commitizen
- 🔍 Unused files and dependencies detection with Knip
- 🌍 I18n validation and missing translation detection with i18n-check
- 🐰 AI-powered code reviews with [CodeRabbit](https://www.coderabbit.ai?utm_source=next_js_starter&utm_medium=github&utm_campaign=next_js_starter_oss_2025)
- 🚨 Error Monitoring with [Sentry](https://sentry.io/for/nextjs/?utm_source=github&utm_medium=paid-community&utm_campaign=general-fy25q1-nextjs&utm_content=github-banner-nextjsboilerplate-logo)
- 🔍 Local development error monitoring with Sentry Spotlight
- 📝 Logging with LogTape and Log Management with [Better Stack](https://betterstack.com/?utm_source=github&utm_medium=sponsorship&utm_campaign=next-js-boilerplate)
- 🖥️ Monitoring as Code with [Checkly](https://www.checklyhq.com/?utm_source=github&utm_medium=sponsorship&utm_campaign=next-js-boilerplate)
- 🔐 Security and bot protection ([Arcjet](https://launch.arcjet.com/Q6eLbRE))
- 🎁 Automatic changelog generation with Semantic Release
- 💡 Absolute Imports using `@` prefix
- 🗂 VSCode configuration: Debug, Settings, Tasks and Extensions
- 🤖 SEO metadata, JSON-LD and Open Graph tags
- 🗺️ Sitemap.xml and robots.txt
- 👷 Automatic dependency updates with Dependabot
- ⚙️ Bundler Analyzer
- 🌈 Include a FREE minimalist theme
- 💯 Maximize lighthouse score

Built-in features from Next.js:

- ☕ Minify HTML & CSS
- 💨 Live reload
- ✅ Cache busting

Optional features (easy to add):

- 🔑 Multi-tenancy, Role-based access control (RBAC)
- 🔐 OAuth for Single Sign-On (SSO), Enterprise SSO, SAML, OpenID Connect (OIDC), EASIE
- 🔗 Web 3 (Base, MetaMask, Coinbase Wallet, OKX Wallet)

### Philosophy

- Nothing is hidden from you, allowing you to make any necessary adjustments to suit your requirements and preferences.
- Dependencies are regularly updated on a monthly basis
- Start for free without upfront costs
- Easy to customize
- Minimal code
- Unstyled template
- SEO-friendly
- 🚀 Production-ready

### Requirements

- Node.js 24+ and pnpm

### Getting started with Dev Containers

The project includes a `.devcontainer/` configuration for a fully reproducible development environment via [VS Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers) or [GitHub Codespaces](https://github.com/features/codespaces).

1. Open the project in VS Code and run **Dev Containers: Reopen in Container** from the command palette, or launch a new Codespace on GitHub.
2. The container automatically installs Node.js 24, enables corepack with the pinned pnpm version, runs `pnpm install --frozen-lockfile`, and sets up Lefthook git hooks.
3. Create a `.env.local` file with your Clerk and other required keys (see [Set up authentication](#set-up-authentication) below).
4. Start the dev server:

```shell
pnpm dev
```

Port 3000 (Next.js) opens in your browser automatically. Port 8969 (Sentry Spotlight) is also forwarded.

#### Maintainer note

If you're forking this project, ensure `.devcontainer/post-create.sh` keeps its executable bit in git:

```shell
# macOS/Linux:
chmod +x .devcontainer/post-create.sh

# Windows (sets the bit in git directly):
git update-index --chmod=+x .devcontainer/post-create.sh
```

### Run dev in Docker (without VS Code)

If you'd rather not install Node/pnpm on your host — or want a fully containerized dev environment for onboarding, isolation, or reproducing reports — use the dev compose file:

```shell
cp .env.dev.example .env.local   # then fill in your Clerk keys
docker compose -f compose.dev.yaml up --build
```

Open http://localhost:3000 (Next.js) and http://localhost:8969 (Sentry Spotlight).

Source is bind-mounted, so host-side edits trigger HMR inside the container. `node_modules`, `.next`, and the pnpm store live in named Docker volumes for performance — destroy them with `docker compose -f compose.dev.yaml down -v` when you want a fully clean rebuild.

**On macOS / Windows:** native `pnpm dev` is significantly faster than dev-in-Docker due to VirtioFS filesystem overhead. Reserve this for cases where host parity isn't an option.

### Getting started with Nix

The project includes a `flake.nix` for a reproducible development environment using [Nix](https://nixos.org/).

**Prerequisites:** Install Nix with flakes enabled. The recommended installer is [Determinate Nix Installer](https://github.com/DeterminateSystems/nix-installer) which enables flakes by default.

1. Enter the development shell:

```shell
nix develop
```

2. Install dependencies and start the dev server:

```shell
pnpm install
pnpm dev
```

**Optional: automatic shell activation with direnv**

If you use [direnv](https://direnv.net/), create an `.envrc` file in the project root:

```shell
echo "use flake" > .envrc
direnv allow
```

The development environment will activate automatically when you `cd` into the project directory.

### Set up authentication

To get started, create a Clerk account at [Clerk.com](https://clerk.com?utm_source=github&utm_medium=sponsorship&utm_campaign=nextjs-boilerplate) and create a new application in the Clerk Dashboard. Then copy the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` values and add them to your `.env.local` file (not tracked by Git):

```shell
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

You now have a fully functional authentication system with Next.js, including features such as sign up, sign in, sign out, forgot password, reset password, update profile, update password, update email, delete account, and more.

### Translation (i18n) setup

For translation, the project uses `next-intl` combined with [Crowdin](https://l.crowdin.com/next-js). As a developer, you only need to take care of the English (or another default language) version. Translations for other languages are automatically generated and handled by Crowdin. You can use Crowdin to collaborate with your translation team or translate the messages yourself with the help of machine translation.

To set up translation (i18n), create an account at [Crowdin.com](https://l.crowdin.com/next-js) and create a new project. In the newly created project, you will be able to find the project ID. You will also need to create a new Personal Access Token by going to Account Settings > API. Then, in your GitHub Actions, you need to define the following environment variables: `CROWDIN_PROJECT_ID` and `CROWDIN_PERSONAL_TOKEN`.

After defining the environment variables in your GitHub Actions, your localization files will be synchronized with Crowdin every time you push a new commit to the `main` branch.

### Project structure

```shell
.
├── README.md                       # README file
├── .github                         # GitHub folder
│   ├── actions                     # Reusable actions
│   └── workflows                   # GitHub Actions workflows
├── .vscode                         # VSCode configuration
├── public                          # Public assets folder
├── src
│   ├── app                         # Next JS App (App Router)
│   ├── components                  # React components
│   ├── libs                        # 3rd party libraries configuration
│   ├── locales                     # Locales folder (i18n messages)
│   ├── styles                      # Styles folder
│   ├── templates                   # Templates folder
│   ├── types                       # Type definitions
│   ├── utils                       # Utilities folder
│   └── validations                 # Validation schemas
├── eslint.config.mjs               # ESLint configuration
├── next.config.ts                  # Next JS configuration
├── package.json                    # pnpm dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
```

### Customization

**For the full SEO / marketing / branding pre-launch checklist, see [`docs/SEO_AND_MARKETING.md`](./docs/SEO_AND_MARKETING.md).**

**For the dependency / supply-chain security workflow (audits, overrides, lefthook gates), see [`docs/DEPENDENCY_SECURITY.md`](./docs/DEPENDENCY_SECURITY.md).**

You can easily configure Next js Boilerplate by searching the entire project for `FIXME:` to make quick customizations. Here are some of the most important files to customize:

- `public/apple-touch-icon.png`, `public/favicon.ico`, `public/favicon-16x16.png` and `public/favicon-32x32.png`: your website favicon
- `src/utils/app-config.ts`: configuration file
- `src/templates/BaseTemplate.tsx`: default theme
- `next.config.ts`: Next.js configuration
- `.env.local`: environment variables (copy `.env.example` to create it)

You have full access to the source code for further customization. The provided code is just an example to help you start your project. The sky's the limit 🚀.

### Commit Message Format

The project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification, meaning all commit messages must be formatted accordingly. To help you write commit messages, the project provides an interactive CLI that guides you through the commit process. To use it, run the following command:

```shell
pnpm run commit
```

One of the benefits of using Conventional Commits is the ability to automatically generate GitHub releases. It also allows us to automatically determine the next version number based on the types of commits that are included in a release.

#### Commit Types

Every commit message follows Conventional Commits and must begin with a type prefix (e.g., `feat: add login page`). The table below lists the available types:

| Type | Description |
| --- | --- |
| `feat` | New feature or functionality |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code formatting without logic changes |
| `refactor` | Code restructuring without behavior changes |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `build` | Build system |
| `ci` | CI configuration and scripts |
| `chore` | Maintenance tasks (dependencies, config) |
| `revert` | Reverts a previous commit |

### CodeRabbit AI Code Reviews

The project uses [CodeRabbit](https://www.coderabbit.ai?utm_source=next_js_starter&utm_medium=github&utm_campaign=next_js_starter_oss_2025), an AI-powered code reviewer. CodeRabbit monitors your repository and automatically provides intelligent code reviews on all new pull requests using its powerful AI engine.

Setting up CodeRabbit is simple, visit [coderabbit.ai](https://www.coderabbit.ai?utm_source=next_js_starter&utm_medium=github&utm_campaign=next_js_starter_oss_2025), sign in with your GitHub account, and add your repository from the dashboard. That's it!

### Deploy to production

Generate a production build with:

```shell
pnpm run build
```

It generates an optimized production build of the boilerplate. To test the generated build, run:

```shell
pnpm run start
```

You need to define the environment variable `CLERK_SECRET_KEY` using your own key.

This command starts a local server using the production build. You can now open http://localhost:3000 in your preferred browser to see the result.

### Error Monitoring

The project uses [Sentry](https://sentry.io/for/nextjs/?utm_source=github&utm_medium=paid-community&utm_campaign=general-fy25q1-nextjs&utm_content=github-banner-nextjsboilerplate-logo) to monitor errors.

#### Local development with Sentry and Spotlight

In the development environment, no additional setup is required: Next.js Boilerplate comes pre-configured with Sentry and Spotlight (Sentry for Development). All errors are automatically captured by your local Spotlight instance, enabling testing without sending data to Sentry Cloud.

You can inspect captured events, view stack traces, and analyze errors in the Spotlight UI at `http://localhost:8969`.

#### Production setup with Sentry

For a production environment, you'll need to create a Sentry account and a new project, then supply the following environment variables through your host's configuration:

```shell
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_ORGANIZATION=
SENTRY_PROJECT=
```

You also need to create a environment variable `SENTRY_AUTH_TOKEN` in your hosting provider's dashboard.

### Code coverage

Next.js Boilerplate relies on [Codecov](https://about.codecov.io/codecov-free-trial/?utm_source=github&utm_medium=paid-community&utm_campaign=general-fy25q1-nextjs&utm_content=github-banner-nextjsboilerplate-logo) for code coverage reporting solution. To enable Codecov, create a Codecov account and connect it to your GitHub account. Your repositories should appear on your Codecov dashboard. Select the desired repository and copy the token. In GitHub Actions, define the `CODECOV_TOKEN` environment variable and paste the token.

Make sure to create `CODECOV_TOKEN` as a GitHub Actions secret, do not paste it directly into your source code.

### Logging

The project uses LogTape for logging. In the development environment, logs are displayed in the console by default.

For production, the project is already integrated with [Better Stack](https://betterstack.com/?utm_source=github&utm_medium=sponsorship&utm_campaign=next-js-boilerplate) to manage and query your logs using SQL. To use Better Stack, you need to create a [Better Stack](https://betterstack.com/?utm_source=github&utm_medium=sponsorship&utm_campaign=next-js-boilerplate) account and create a new source: go to your Better Stack Logs Dashboard > Sources > Connect source. Then, you need to give a name to your source and select Node.js as the platform.

After creating the source, copy its source token into the server-only `BETTER_STACK_SOURCE_TOKEN` variable. Define `BETTER_STACK_INGESTING_HOST` from the same screen. Keep both values in an untracked `.env.local` file or your deployment platform's secret store.

Now, all logs will automatically be sent to and ingested by Better Stack.


### Arcjet security and bot protection

The project uses [Arcjet](https://launch.arcjet.com/Q6eLbRE), a security as code product that includes several features that can be used individually or combined to provide defense in depth for your site.

To set up Arcjet, [create a free account](https://launch.arcjet.com/Q6eLbRE) and get your API key. Then add it to the `ARCJET_KEY` environment variable.

Arcjet is configured with two main features: bot detection and the Arcjet Shield WAF:

- [Bot detection](https://docs.arcjet.com/bot-protection/concepts) is configured to allow search engines, preview link generators e.g. Slack and Twitter previews, and to allow common uptime monitoring services. All other bots, such as scrapers and AI crawlers, will be blocked. You can [configure additional bot types](https://docs.arcjet.com/bot-protection/identifying-bots) to allow or block.
- [Arcjet Shield WAF](https://docs.arcjet.com/shield/concepts) will detect and block common attacks such as SQL injection, cross-site scripting, and other OWASP Top 10 vulnerabilities.

Arcjet is configured with a central client at `src/libs/Arcjet.ts` that includes the Shield WAF rules. Additional rules are applied when Arcjet is called in `proxy.ts`.

### Useful commands

### Code Quality and Validation

The project includes several commands to ensure code quality and consistency. You can run:

- `pnpm run lint` to check for linting errors
- `pnpm run lint:fix` to automatically fix fixable issues from the linter
- `pnpm run check:types` to verify type safety across the entire project
- `pnpm run check:deps` help identify unused dependencies and files
- `pnpm run check:i18n` ensures all translations are complete and properly formatted

#### Bundle Analyzer

Next.js Boilerplate includes a built-in bundle analyzer. It can be used to analyze the size of your JavaScript bundles. To begin, run the following command:

```shell
pnpm run build-stats
```

By running the command, it'll automatically open a new browser window with the results.

### VSCode information (optional)

If you are VSCode user, you can have a better integration with VSCode by installing the suggested extension in `.vscode/extension.json`. The starter code comes up with Settings for a seamless integration with VSCode. The Debug configuration is also provided for frontend and backend debugging experience.

With the plugins installed in your VSCode, Oxlint and Oxfmt can automatically fix the code and display errors.

Pro tips: if you need a project wide-type checking with TypeScript, you can run a build with <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd> on Mac.

### License

Licensed under the MIT License, Copyright © 2026
See [LICENSE](LICENSE) for more information.
