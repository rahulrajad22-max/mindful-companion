import { Volume2, VolumeX, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { VoiceLanguage, VOICE_LANGUAGES } from "@/hooks/useVoiceAssistant";

interface VoiceAssistantControlsProps {
  isEnabled: boolean;
  isSpeaking: boolean;
  isLoading: boolean;
  selectedLanguage: VoiceLanguage;
  onToggle: () => void;
  onLanguageChange: (language: VoiceLanguage) => void;
  onTestVoice: () => void;
  className?: string;
}

export function VoiceAssistantControls({
  isEnabled,
  isSpeaking,
  isLoading,
  selectedLanguage,
  onToggle,
  onLanguageChange,
  onTestVoice,
  className,
}: VoiceAssistantControlsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Language Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isSpeaking}
            className="h-8 px-2 text-xs"
            title="Select voice language"
          >
            <span className="text-base mr-1">{selectedLanguage.flag}</span>
            <span className="hidden sm:inline">{selectedLanguage.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto bg-popover z-50">
          {VOICE_LANGUAGES.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => onLanguageChange(language)}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                selectedLanguage.code === language.code && "bg-primary/10"
              )}
            >
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Test Voice Button */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onTestVoice}
        disabled={isSpeaking || isLoading}
        className="h-8 gap-1"
        title="Test voice in selected language"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Play className="h-4 w-4" />
        )}
        <span className="hidden sm:inline text-xs">Test</span>
      </Button>

      {/* Voice Toggle Button */}
      <Button
        type="button"
        variant={isEnabled ? "default" : "outline"}
        size="sm"
        onClick={onToggle}
        className={cn(
          "relative h-8 gap-1",
          isEnabled && "bg-primary text-primary-foreground",
          isSpeaking && "animate-pulse"
        )}
        title={isEnabled ? "Disable voice assistant" : "Enable voice assistant"}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isEnabled ? (
          <Volume2 className="h-4 w-4" />
        ) : (
          <VolumeX className="h-4 w-4" />
        )}
        <span className="hidden sm:inline text-xs">
          {isEnabled ? "Voice On" : "Voice Off"}
        </span>
        
        {/* Speaking indicator */}
        {isSpeaking && (
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
        )}
      </Button>
    </div>
  );
}
