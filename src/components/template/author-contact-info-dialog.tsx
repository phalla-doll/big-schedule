import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { User } from "@/lib/global-interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultUser } from '@/lib/utils';

interface AuthorContactInfoDialogProps {
    isOpen: boolean;
    author: User | undefined;
    onClose: () => void;
    onSave?: (author: User) => void;
}

export default function AuthorContactInfoDialog({ isOpen, onClose, author, onSave }: AuthorContactInfoDialogProps) {
    const [formData, setFormData] = useState<User>(author || defaultUser);

    useEffect(() => {
        if (isOpen) {
            setFormData(author || defaultUser);
        }
    }, [isOpen, author]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [id]: value,
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (onSave) {
            const userToSave: User = {
                ...(author || {}),
                ...formData,
            };
            onSave(userToSave);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>Agenda Owner Contact Information</DialogTitle>
                <DialogDescription>
                    A contact information of the agenda owner. If viewers want to get in touch with the owner.
                </DialogDescription>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-2 my-4"> {/* Added my-4 for spacing, original was mb-4 */}
                        <div>
                            <Label htmlFor="name" className="mb-1.5 text-sm text-muted-foreground">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email" className="mb-1.5 text-sm text-muted-foreground">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone" className="mb-1.5 text-sm text-muted-foreground">
                                Phone
                            </Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={onClose}
                            type="button" // Ensure this button doesn't submit the form
                        >
                            Close
                        </Button>
                        <Button
                            variant="default"
                            type="submit" // This button will submit the form
                        >
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
