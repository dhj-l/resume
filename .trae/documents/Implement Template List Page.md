I will implement the Template List Page as requested.

### 1. Define Types
Create `src/views/template/types.ts` to define the `ResumeTemplate` interface and `TemplateListProps`.

### 2. Create Template Card Component
Create `src/views/template/components/TemplateCard.vue` with:
- **Props**: Receives a `template` object.
- **Layout**: 
  - Preview image (70% height) with hover overlay and "Use Template" button.
  - Info area (30% height) with title, usage count (User icon), date (Calendar icon), and category (Tag icon).
- **Style**: Rounded corners, shadow, scale effect on hover, Tailwind CSS.

### 3. Create Template List Page
Create `src/views/template/TemplateListPage.vue` with:
- **Layout**: Use `a-layout` inside the main container.
- **Breadcrumb**: "Home > Template List" using `a-breadcrumb`.
- **Header**: Title "Professional Resume Templates" and subtitle.
- **Grid**: Responsive grid (1 col < 900px, 2 cols < 1200px, 3 cols >= 1200px).
- **Empty State**: Use `a-empty` with custom icon and message.
- **Data**: Mock static data (6-8 items).
- **Interactions**: Click card to navigate to `/templates/:id`.

### 4. Update Router
Update `src/router/index.ts` to:
- Add `/templates` route pointing to `TemplateListPage.vue`.
- Ensure it renders within the existing `HomePage.vue` layout (so NavBar and Footer are preserved).
- Add a placeholder route for `/templates/:id`.
