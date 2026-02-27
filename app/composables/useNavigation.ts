import { ref } from 'vue';

export const useNavigation = () => {
    const isMobileMenuOpen = useState('isMobileMenuOpen', () => false);

    const toggleMenu = () => {
        isMobileMenuOpen.value = !isMobileMenuOpen.value;
    };

    const closeMenu = () => {
        isMobileMenuOpen.value = false;
    };

    const openMenu = () => {
        isMobileMenuOpen.value = true;
    };

    return {
        isMobileMenuOpen,
        toggleMenu,
        closeMenu,
        openMenu
    };
};
