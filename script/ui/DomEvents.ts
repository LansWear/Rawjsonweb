// script/ui/DomEvents.ts

import { AppState } from '../utils.js';

export class DomEvents {
    private appState: AppState;

    constructor(appState: AppState) {
        this.appState = appState;
    }

    public initTheme(): void {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            this.appState.isDarkMode = true;
            document.documentElement.classList.add('dark');
        }
        document.getElementById('toggle-dark-mode')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleTheme();
        });
    }

    public toggleTheme(): void {
        this.appState.isDarkMode = !this.appState.isDarkMode;
        document.documentElement.classList.toggle('dark', this.appState.isDarkMode);
        localStorage.setItem('theme', this.appState.isDarkMode ? 'dark' : 'light');
    }

    public initMenu(): void {
        const menuButton = document.getElementById('menu-button');
        const menuContent = document.getElementById('menu-content');

        menuButton?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.appState.isMenuOpen = !this.appState.isMenuOpen;
            menuContent?.classList.toggle('hidden', !this.appState.isMenuOpen);
        });

        document.addEventListener('click', () => {
            if (this.appState.isMenuOpen) {
                this.appState.isMenuOpen = false;
                menuContent?.classList.add('hidden');
            }
        });
    }
}
