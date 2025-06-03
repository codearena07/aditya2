# Modern 3D Frontend Developer Portfolio

A unique, interactive, and modern portfolio website designed specifically for frontend developers. This portfolio showcases advanced frontend skills with impressive 3D effects and animations powered by Three.js and GSAP.

![Portfolio Preview](https://via.placeholder.com/800x400)

## 🚀 Features

- **Modern Design**: Clean and professional UI with attention to detail
- **3D Effects**: Interactive 3D elements using Three.js
- **Smooth Animations**: Polished animations using GSAP and ScrollTrigger
- **Dark/Light Mode**: Toggle between color themes
- **Responsive Layout**: Works perfectly on all devices
- **Custom Cursor**: Interactive cursor effects
- **Loading Animation**: Professional preloader
- **Project Filtering**: Filter projects by category
- **Testimonials Slider**: Showcase client testimonials
- **Contact Form**: Functional contact form (needs backend integration)
- **Optimized Performance**: Fast loading and smooth scrolling

## 📋 Sections

1. **Hero**: Impressive introduction with 3D particle background
2. **About**: Personal information with animated stats
3. **Skills**: Technical skills with progress bars and floating 3D elements
4. **Projects**: Portfolio projects with filtering and hover effects
5. **Testimonials**: Client testimonials with slider
6. **Contact**: Contact form with animated fields
7. **Footer**: Additional information and newsletter signup

## 🛠️ Technologies Used

- HTML5
- CSS3 (with modern features)
- JavaScript (ES6+)
- [Three.js](https://threejs.org/) - 3D graphics
- [GSAP](https://greensock.com/gsap/) - Animations
- [ScrollTrigger](https://greensock.com/scrolltrigger/) - Scroll-based animations
- [Font Awesome](https://fontawesome.com/) - Icons
- [Google Fonts](https://fonts.google.com/) - Typography

## 📝 How to Customize

### Personal Information

1. Open `index.html` and replace:
   - Your name in the hero section
   - About me text
   - Skills and percentages
   - Project information
   - Contact details

### Profile Image

1. Replace the placeholder image in the About section with your own photo
2. Recommended size: 400x500px

### Projects

1. For each project, update:
   - Project image
   - Project title
   - Project description
   - Technologies used
   - Links to live demo and GitHub repository

### Colors

1. Open `styles.css` and modify the CSS variables in the `:root` selector:
   ```css
   :root {
       --primary-color: #6c63ff;
       --secondary-color: #4d44db;
       --accent-color: #00c9a7;
       /* more variables here */
   }
   ```

### 3D Effects

1. To modify the 3D effects, edit the `initHero3D()` and `initSkills3D()` functions in `script.js`
2. You can adjust particle count, colors, sizes, and animation speeds

## 🖥️ Installation

1. Download or clone this repository
2. Open `index.html` in your browser
3. For development, use a local server (like Live Server for VS Code)

## 📱 Responsive Design

The portfolio is fully responsive and works well on:
- Desktop computers
- Tablets
- Mobile phones

The layout adapts automatically to different screen sizes.

## ⚙️ Performance Optimization

For better performance:
1. Optimize your images using tools like [TinyPNG](https://tinypng.com/)
2. Consider lazy loading images for faster initial load
3. Deploy to a CDN for faster content delivery

## 🔗 Additional Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [GSAP Documentation](https://greensock.com/docs/)
- [Font Awesome Icons](https://fontawesome.com/icons)

## 📄 License

This project is available for personal and commercial use.

## 👨‍💻 Need Help?

If you need help customizing this portfolio or have any questions, feel free to reach out!

---

Designed and developed with ❤️ for frontend developers. 