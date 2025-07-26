import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from '@/components/ui/menubar';
import { type Group, type Menu } from '@/types';
import { Link } from '@inertiajs/react';
import _ from 'lodash';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { Fragment, ReactNode } from 'react';

type MainMenuProps = {
    groups: Array<Group> | null;
    menus: Array<Menu> | null;
};

export default function MainMenu({ groups, menus }: Readonly<MainMenuProps>): ReactNode {
    if (!groups) return <div className="flex w-full text-nowrap">Loading...</div>;
    if (!menus) return <div className="flex w-full text-nowrap">Menu not found, please contact your administrator.</div>;

    return (
        <Menubar className="rounded-none border-none bg-[#F6F8FA] shadow-none dark:bg-black">
            {groups.map((group) => {
                const dataMenus = _.pickBy(menus, (menu) => menu.group_code === group.code) as Array<Menu>;

                return (
                    <MenubarMenu key={group.code}>
                        <MenubarTrigger className="h-9 cursor-pointer px-3">
                            <DynamicIcon name={group.icon as IconName} className="mr-2 h-4 w-4" />
                            {group.name}
                        </MenubarTrigger>
                        {renderMenus(dataMenus)}
                    </MenubarMenu>
                );
            })}
        </Menubar>
    );
}

const renderMenus = (menus: Array<Menu>): ReactNode => {
    return (
        menus && (
            <MenubarContent>
                {_.map(menus, (menu) => {
                    return (
                        <Fragment key={`${menu.code}`}>
                            {menu.children ? (
                                <MenubarSub>
                                    <MenubarSubTrigger className="cursor-pointer">
                                        <DynamicIcon name={menu.icon as IconName} className="mr-2 h-4 w-4" />
                                        {menu.name}
                                    </MenubarSubTrigger>
                                    {renderSubMenus(menu.children)}
                                </MenubarSub>
                            ) : (
                                <Link href={menu.path}>
                                    <MenubarItem className="cursor-pointer">
                                        <DynamicIcon name={menu.icon as IconName} className="h-4 w-4" />
                                        {menu.name}
                                    </MenubarItem>
                                </Link>
                            )}
                        </Fragment>
                    );
                })}
            </MenubarContent>
        )
    );
};

const renderSubMenus = (menus: Array<Menu>): ReactNode => {
    return (
        menus && (
            <MenubarSubContent>
                {_.map(menus, (menu) => {
                    return (
                        <Fragment key={`${menu.code}`}>
                            {menu.children ? (
                                <MenubarSub>
                                    <MenubarSubTrigger className="cursor-pointer">
                                        <DynamicIcon name={menu.icon as IconName} className="mr-2 h-4 w-4" />
                                        {menu.name}
                                    </MenubarSubTrigger>
                                    {renderSubMenus(menu.children)}
                                </MenubarSub>
                            ) : (
                                <Link href={menu.path}>
                                    <MenubarItem className="cursor-pointer">
                                        <DynamicIcon name={menu.icon as IconName} className="h-4 w-4" />
                                        {menu.name}
                                    </MenubarItem>
                                </Link>
                            )}
                        </Fragment>
                    );
                })}
            </MenubarSubContent>
        )
    );
};
