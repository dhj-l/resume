I will implement the PC homepage for "University Student Resume" following your design specifications and component structure.

### 1. Design System Configuration

* **Update** **`tailwind.config.ts`**:

  * Set **Primary Color** to `#1677ff` (Tech Blue).

  * Add **Success Color** `#52c41a` and **AI Color** `#722ed1`.

  * Configure fonts (Inter, PingFang SC) and drop shadows.

### 2. Component Implementation

I will create the requested modular structure:

* **Layout Components**:

  * `src/components/layout/NavBar.vue`: Sticky header with glassmorphism, navigation links, and login/user state management.

  * `src/components/layout/Footer.vue`: Footer with site links and copyright info.

* **Feature Components**:

  * `src/components/home/HeroSection.vue`: Split layout with value proposition and visual area.

  * `src/components/home/FeatureShowcase.vue`: 6 key features in a 3-column grid with hover effects.

  * `src/components/home/TemplateGallery.vue`: 6 templates display with preview and interaction.

  * `src/components/home/DataTrust.vue`: Social proof section with user statistics.

### 3. Page Assembly

* **Create** **`src/views/home/HomePage.vue`**:

  * Assemble all components in the specified order:
    `NavBar` -> `HeroSection` -> `FeatureShowcase` -> `TemplateGallery` -> `DataTrust` -> `Footer`

  * Implement scroll animations (fade-in + slide-up) for each section.

### 4. Routing

* **Update** **`src/router/index.ts`**:

  * Point the root path `/` to the new `HomePage.vue`.

  * Adjust layout configuration to ensure the `NavBar` and `Footer` are rendered correctly (controlled by `HomePage.vue`).

### 5. Interaction & Animation

* Implement hover states for cards and buttons.

* Add entrance animations using Vue `Transition` and CSS classes.

