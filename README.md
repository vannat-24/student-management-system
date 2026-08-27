single-class-management/
├── assets/
│   └── css/
│       └── main.css                  # Tailwind directives & Font
│
├── components/
│   ├── Navbar.vue                    # បង្ហាញ Role បច្ចុប្បន្ន & Switcher
│   ├── AdminRoster.vue               # Admin: គ្រប់គ្រងបញ្ជីឈ្មោះ & បិទ/បើកសោពិន្ទុ
│   ├── TeacherGradeTable.vue         # Teacher: បញ្ចូល និងកែសម្រួលពិន្ទុ
│   └── StudentGradeCard.vue          # Student: មើលលទ្ធផលពិន្ទុផ្ទាល់ខ្លួន
│
├── composables/
│   ├── useAuth.ts                    # គ្រប់គ្រង Role ('admin' | 'teacher' | 'student')
│   └── useScores.ts                  # CRUD ទិន្នន័យពិន្ទុ, រក្សាទុកក្នុង localStorage
│
├── pages/
│   |── auth/
│   │   ├── login.vue                 # [បន្ថែម] ទំព័រ /auth/login
│   │   └── register.vue              # [បន្ថែម] ទំព័រ /auth/register
│   ├── index.vue                     # ទំព័រដើម (Dashboard + ជ្រើសរើស Role ចូលប្រើ)
│   ├── gradebook.vue                 # ផ្ទាំងសម្រាប់ Teacher បញ្ចូលពិន្ទុ
│   ├── student.vue                   # ផ្ទាំងសម្រាប់ Student ពិនិត្យពិន្ទុ
│   └── admin.vue                     # ផ្ទាំងសម្រាប់ Admin គ្រប់គ្រង
│
├── utils/
│   └── gradeCalculations.ts          # រូបមន្តគណនា Total, Average, Grade (A-F), Rank
│
├── app.vue                           # Root Component
├── nuxt.config.ts                    # កំណត់ Tailwind
└── package.json



# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
