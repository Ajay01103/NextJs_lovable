/** biome-ignore-all lint/suspicious/noArrayIndexKey: fine to use */
import { ChevronRight, FileIcon, Folder } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import type { TreeItem } from "@/types"

interface Props {
  data: TreeItem[]
  value?: string | null
  onSelect?: (value: string) => void
}

export const TreeView = ({ data, onSelect, value }: Props) => {
  return (
    <SidebarProvider>
      <Sidebar
        collapsible="none"
        className="w-full">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.map((item, i) => (
                  <Tree
                    key={i}
                    item={item}
                    selectedValue={value}
                    onSelect={onSelect}
                    parentPath=""
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  )
}

interface TreeProps {
  item: TreeItem
  selectedValue?: string | null
  onSelect?: (value: string) => void
  parentPath: string
}

const Tree = ({ item, parentPath, onSelect, selectedValue }: TreeProps) => {
  const [name, ...items] = Array.isArray(item) ? item : [item]
  const currentPath = parentPath ? `${parentPath}/${name}` : name

  if (!items.length) {
    //its a file
    const isSelected = selectedValue === currentPath

    return (
      <SidebarMenuButton
        isActive={isSelected}
        className="data-[active=true]:bg-transparent"
        onClick={() => onSelect?.(currentPath)}>
        <FileIcon />
        <span className="truncate">{name}</span>
      </SidebarMenuButton>
    )
  }

  //its a folder
  return (
    <SidebarMenuItem>
      <Collapsible
        defaultOpen
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="transition-transform">
            <ChevronRight className="transition-transform" />
            <Folder />
            <span className="truncate">{name}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((subItem, i) => (
              <Tree
                key={i}
                item={subItem}
                selectedValue={selectedValue}
                onSelect={onSelect}
                parentPath={currentPath}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}
