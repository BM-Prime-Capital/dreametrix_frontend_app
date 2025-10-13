"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Frown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Drama,
  Save,
  Loader2,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { useCharacters, type Character } from "@/hooks/useCharacters";
import { useToast } from "@/components/ui/use-toast";

const CharacterCardSkeleton = () => (
  <Card className="p-4 animate-pulse h-full">
    <div className="flex flex-col h-full">
      <div className="p-3 bg-gray-200 rounded-lg w-fit mb-3">
        <div className="h-6 w-6 bg-gray-300 rounded"></div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-6 bg-gray-200 rounded flex-1"></div>
          <div className="h-5 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded mb-3"></div>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded mt-3 pt-2 border-t"></div>
      </div>
    </div>
  </Card>
);

const HeaderSkeleton = () => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div>
      <div className="h-7 w-48 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-32 bg-gray-200 rounded"></div>
    </div>
    <div className="flex gap-2 w-full md:w-auto">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="h-9 w-24 bg-gray-200 rounded"></div>
      ))}
    </div>
  </div>
);

const SearchBarSkeleton = () => (
  <Card className="p-4">
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
      <div className="flex gap-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-9 w-36 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  </Card>
);

const CharacterContextMenu = ({ 
  character, 
  onView, 
  onEdit, 
  onDelete 
}: {
  character: Character;
  onView: (character: Character) => void;
  onEdit: (character: Character) => void;
  onDelete: (character: Character) => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={(e) => e.stopPropagation()}
      >
        <MoreVertical className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(character); }}>
        <Eye className="h-4 w-4 mr-2" />
        View
      </DropdownMenuItem>
      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(character); }}>
        <Edit className="h-4 w-4 mr-2" />
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem 
        onClick={(e) => { e.stopPropagation(); onDelete(character); }}
        className="text-red-600"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const DeleteCharacterDialog = ({
  isOpen,
  onClose,
  onConfirm,
  characterName,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  characterName: string;
  isLoading: boolean;
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Delete Character</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete &quot;{characterName}&quot;? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          variant="destructive" 
          onClick={onConfirm}
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          Delete
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

export default function CharactersPage() {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [characterToDelete, setCharacterToDelete] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showGoodOnly, setShowGoodOnly] = useState(false);
  const [showBadOnly, setShowBadOnly] = useState(false);
  
  const { accessToken } = useRequestInfo();
  const { toast } = useToast();
  const { 
    goodCharacters,
    badCharacters,
    allCharacters,
    isLoading: isLoadingCharacters, 
    error: charactersError, 
    totalCount,
    refreshCharacters,
    createNewCharacter,
    updateExistingCharacter,
    deleteExistingCharacter
  } = useCharacters();

  // Load characters on component mount
  useEffect(() => {
    if (accessToken) {
      refreshCharacters(accessToken);
    }
  }, [accessToken, refreshCharacters]);

  const filteredCharacters = allCharacters.filter((character: Character) => {
    const matchesSearch = character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      character.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (showGoodOnly) {
      return matchesSearch && goodCharacters.includes(character);
    }
    
    if (showBadOnly) {
      return matchesSearch && badCharacters.includes(character);
    }
    
    return matchesSearch;
  });

  const handleViewCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setIsViewModalOpen(true);
  };

  const handleEditCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setIsFormModalOpen(true);
  };

  const handleDeleteCharacter = (character: Character) => {
    setCharacterToDelete(character);
    setIsDeleteDialogOpen(true);
  };

  const handleCardClick = (character: Character) => {
    handleViewCharacter(character);
  };

  const handleAddCharacter = () => {
    setSelectedCharacter(null);
    setIsFormModalOpen(true);
  };

  const handleSubmitCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      
      const characterData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        value_point: parseInt(formData.get('valuePoint') as string) || 0,
        character_type: formData.get('characterType') as "good" | "bad",
      };

      if (!accessToken) {
        throw new Error("No access token available");
      }

      let result;
      if (selectedCharacter) {
        // Edit mode - update existing character
        result = await updateExistingCharacter(accessToken, selectedCharacter.id, characterData);
      } else {
        // Create mode - create new character
        result = await createNewCharacter(accessToken, characterData);
      }
      
      if (result.success) {
        toast({
          title: "Success",
          description: selectedCharacter 
            ? `Character "${characterData.name}" updated successfully` 
            : `Character "${characterData.name}" created successfully`,
        });
        setIsFormModalOpen(false);
        setSelectedCharacter(null);
        // Reset form
        (e.target as HTMLFormElement).reset();
      } else {
        toast({
          title: "Error",
          description: result.error || `Failed to ${selectedCharacter ? 'update' : 'create'} character`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting character:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteCharacter = async () => {
    if (!characterToDelete) return;
    
    setIsLoading(true);
    try {
      if (!accessToken) {
        throw new Error("No access token available");
      }

      const result = await deleteExistingCharacter(accessToken, characterToDelete.id);
      
      if (result.success) {
        toast({
          title: "Success",
          description: `Character "${characterToDelete.name}" deleted successfully`,
        });
        setIsDeleteDialogOpen(false);
        setCharacterToDelete(null);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete character",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting character:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the character",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCharacterTypeColor = (type: string) => {
    switch (type) {
      case "good":
        return "bg-green-100 text-green-800";
      case "bad":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getValuePointColor = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-600";
  };

  if (isLoadingCharacters) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <HeaderSkeleton />
        <SearchBarSkeleton />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <CharacterCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Characters Management</h1>
          <p className="text-sm text-gray-500">
            Manage character types and behaviors ({totalCount} total)
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            className="gap-2"
            onClick={async () => {
              if (accessToken) {
                try {
                  await refreshCharacters(accessToken);
                  toast({
                    title: "Success",
                    description: "Characters list refreshed successfully",
                  });
                } catch (error) {
                  console.error("Error refreshing characters:", error);
                  toast({
                    title: "Error",
                    description: "Failed to refresh characters list",
                    variant: "destructive",
                  });
                }
              }
            }}
            disabled={isLoadingCharacters}
          >
            {isLoadingCharacters ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
          <Button
            className="gap-2"
            onClick={handleAddCharacter}
          >
            <Plus className="h-4 w-4" />
            Add Character
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {charactersError && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center gap-2 text-red-800">
            <Frown className="h-5 w-5" />
            <div>
              <h3 className="font-medium">Error loading characters</h3>
              <p className="text-sm">{charactersError}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (accessToken) {
                  refreshCharacters(accessToken);
                }
              }}
              className="ml-auto"
            >
              Retry
            </Button>
          </div>
        </Card>
      )}

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search characters by name or description..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={showGoodOnly ? "default" : "outline"} 
              className="gap-2"
              onClick={() => {
                setShowGoodOnly(!showGoodOnly);
                setShowBadOnly(false);
              }}
            >
              <Filter className="h-4 w-4" />
              Good Characters
            </Button>
            <Button 
              variant={showBadOnly ? "default" : "outline"} 
              className="gap-2"
              onClick={() => {
                setShowBadOnly(!showBadOnly);
                setShowGoodOnly(false);
              }}
            >
              <Filter className="h-4 w-4" />
              Bad Characters
            </Button>
          </div>
        </div>
      </Card>

      {/* Characters Grid */}
      {isLoadingCharacters ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <CharacterCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredCharacters.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCharacters.map((character: Character) => (
            <Card 
              key={character.id}
              className="hover:shadow-md transition-shadow cursor-pointer h-full"
              onClick={() => handleCardClick(character)}
            >
              <div className="p-4 flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-blue-100 rounded-lg text-blue-600 w-fit">
                
                    <Drama className="h-6 w-6" />
                  </div>
                  <CharacterContextMenu
                    character={character}
                    onView={handleViewCharacter}
                    onEdit={handleEditCharacter}
                    onDelete={handleDeleteCharacter}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg truncate">{character.name}</h3>
                    <Badge 
                      variant="outline" 
                      className={`shrink-0 text-xs ${getCharacterTypeColor(character.character_type)}`}
                    >
                      {character.character_type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {character.description}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-gray-500">Value Point:</span>
                    <span className={`font-semibold ${getValuePointColor(character.value_point)}`}>
                      {character.value_point > 0 ? `+${character.value_point}` : character.value_point}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-3 pt-2 border-t">
                  ID: {character.id}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 flex flex-col items-center justify-center gap-4">
          <Frown className="h-12 w-12 text-gray-400" />
          <h3 className="font-medium text-lg">No characters found</h3>
          <p className="text-sm text-gray-500 max-w-md text-center">
            {showGoodOnly 
              ? "No good characters found. Try adjusting your search or filters."
              : showBadOnly
              ? "No bad characters found. Try adjusting your search or filters."
              : "No characters match your search criteria. Try adjusting your search or filters."
            }
          </p>
          <Button variant="outline" onClick={() => {
            setSearchQuery("");
            setShowGoodOnly(false);
            setShowBadOnly(false);
          }}>
            Clear filters
          </Button>
        </Card>
      )}

      {/* Pagination */}
      {!isLoadingCharacters && filteredCharacters.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="text-sm text-gray-500">
            Page 1 of 1
          </div>
          <Button variant="outline" className="gap-2">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Character View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsViewModalOpen(false);
          setSelectedCharacter(null);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Character Details</DialogTitle>
            <DialogDescription>View character information</DialogDescription>
          </DialogHeader>
          {selectedCharacter ? (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Character Name</Label>
                    <p className="text-lg font-semibold">{selectedCharacter.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Character Type</Label>
                    <Badge 
                      variant="outline" 
                      className={`mt-1 ${getCharacterTypeColor(selectedCharacter.character_type)}`}
                    >
                      {selectedCharacter.character_type}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Value Point</Label>
                    <p className={`text-lg font-semibold ${getValuePointColor(selectedCharacter.value_point)}`}>
                      {selectedCharacter.value_point > 0 ? `+${selectedCharacter.value_point}` : selectedCharacter.value_point}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Character ID</Label>
                    <p className="text-sm">{selectedCharacter.id}</p>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Description</Label>
                <p className="text-sm mt-1">{selectedCharacter.description}</p>
              </div>
              <div className="flex justify-end pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedCharacter(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">No character selected</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Character Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedCharacter(null);
        }}
        title={selectedCharacter ? "Edit Character" : "Add New Character"}
        description={
          selectedCharacter 
            ? "Update character information" 
            : "Fill in the details for the new character"
        }
        size="2xl"
      >
        <form onSubmit={handleSubmitCharacter} className="flex flex-col h-full max-h-[80vh]">
          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Character Name*</Label>
                    <Input 
                      id="name" 
                      name="name"
                      placeholder="e.g., Decorum" 
                      defaultValue={selectedCharacter?.name || ""} 
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="characterType">Character Type*</Label>
                    <Select name="characterType" defaultValue={selectedCharacter?.character_type || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select character type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="bad">Bad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="valuePoint">Value Point*</Label>
                    <Input 
                      id="valuePoint" 
                      name="valuePoint"
                      type="number"
                      placeholder="e.g., 4" 
                      defaultValue={selectedCharacter?.value_point || ""} 
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Positive values for good characters, negative for bad characters
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description*</Label>
                    <Textarea 
                      id="description" 
                      name="description"
                      placeholder="Describe the character behavior..." 
                      className="min-h-[200px]" 
                      defaultValue={selectedCharacter?.description || ""} 
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="flex-shrink-0 px-6 py-4 border-t bg-gray-50">
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => {
                  setIsFormModalOpen(false);
                  setSelectedCharacter(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : selectedCharacter ? (
                  <Save className="h-4 w-4 mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {selectedCharacter ? "Update Character" : "Create Character"}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Character Confirmation Dialog */}
      <DeleteCharacterDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setCharacterToDelete(null);
        }}
        onConfirm={confirmDeleteCharacter}
        characterName={characterToDelete?.name || ""}
        isLoading={isLoading}
      />
    </div>
  );
}
