import sys
from datetime import datetime
from difflib import get_close_matches
import random

chatbot = 'Ávila'

# Closest word match function
def closeMatches(word,patterns):
    #if(any(word.lower() in s.lower() for s in patterns)):
    for p in patterns:
        if(p.lower()== word.lower()):
           return p
    try:
        sw=get_close_matches(word, patterns, n=1)[0]
        write_to_text.write(chatbot + ": Do you mean "+ str(sw) +" ?[Yes/No]" + " \n ")
        print("Do you mean "+ str(sw) +" ?[Yes/No]")
        userInput = Check_isEmpty("Do you mean "+ str(sw) +" ?[Yes/No]", input("User: "))
        write_to_text.write("User: " + userInput + " \n ")
        if(userInput.lower()=="n" or userInput.lower()=="no"):
            return ""
    except IndexError:
        sw=""
    return str(sw)

# Making Time stemped File name
dateTimeObj = datetime.now()
timestampStr = dateTimeObj.strftime("%d-%b-%Y_(%H-%M-%S)")
write_to_text=open("CH_"+timestampStr+".txt","w+")
write_to_text.write("Time: "+ timestampStr + " \n ")

# Keywords
Feelings=['anxious', 'worried', 'confused', 'helpless', 'hopeless', 'guilty', 'overwhelmed', 'disoriented', 'isolated', 'mental health']
Need_help=['shelter', 'electricity', 'water', 'food', 'hygiene products', 'medical assistance', 'emergency', 'educational resources', 'pet']
Players=['survivors', 'friends', 'loved ones', 'first responders', 'recovery workers', 'community members']
Natural_Disaster=['tornadoes', 'hurricanes', 'severe/tropical storms', 'floods', 'wildfire', 'earthquake', 'drought', 'infectious disease outbreak']
Human_Caused_Disaster=['industrial accidents', 'shootings', 'act of terrorism', 'mass violence', 'community unrest']
Response_dept=['police', 'ambulance', 'fire brigade', 'paramedics', 'disaster recovery unit', 'health assistance']

'''
#Check if the Input is Integer or not
def Ask_Question(Question, userInput):
    while (True):
        try:
            val = int(userInput)
            break
        except ValueError:
            write_to_text.write(Question + " \n ")
            print(Question)
            userInput = input("User: ")
            write_to_text.write("User: "+ userInput + " \n ")
            continue
    return val
'''

#if the input is empty ask question again
def Check_isEmpty(Question, userInput):
    while (True):
        if(userInput==""):
            print(Question)
            userInput = input("User: ")
        else:
            break
    return userInput

# List of common issues/needs present during emergencies
def Issue(userInput):
    while (True):
        if("shelter" in userInput.lower() or "electricity" in userInput.lower()):
            write_to_text.write(chatbot + ": Here's a list of locations with reliable shelter: "+ " \n ")
            print("Here's a list of locations with reliable shelter: ")
            print("Coming soon.") # add resources
            break

        elif("water" in userInput.lower() or "purified water" in userInput.lower()):
            write_to_text.write(chatbot + ": Here's a list of locations with purified water: "+ " \n ")
            print("Here's a list of locations with purified water: ")
            print("Coming soon.") # add resources
            break

        elif("food" in userInput.lower() or "canned goods" in userInput.lower()):
            write_to_text.write(chatbot + ": Here's a list of locations with canned goods: "+ " \n ")
            print("Here's a list of locations with canned goods: ")
            print("Coming soon.") # add resources
            break

        elif("hygiene products" in userInput.lower() or "hygiene" in userInput.lower() or "sanitation facility" in userInput.lower()):
            write_to_text.write(chatbot + ": Here's the location of sanitation facilities: "+ " \n ")
            print("Here's the location of sanitation facilities: ")
            print("Coming soon.") # add resources
            break

        elif("educational resources" in userInput.lower() or "first aid training" in userInput.lower() or "education" in userInput.lower()):
            write_to_text.write(chatbot + ": Here's some First Aid training locations: "+ " \n ")
            print("Here's some First Aid training locations: ")
            print("Coming soon.") # add resources
            write_to_text.write(chatbot + ": Here's the government guidelines for preparedness supplies: "+ " \n ")
            print("Here's the government guidelines for preparedness supplies: ")
            print("Coming soon.") # add resources
            break

        elif("pet" in userInput.lower() or "dog" in userInput.lower() or "cat" in userInput.lower()):
            write_to_text.write(chatbot + ": Do you have a pet?[Y/N] "+ " \n ")
            print("Do you have a pet?[Y/N] ")
            userInput =Check_isEmpty("Do you have a pet?[Y/N] ", input("User: "))
            write_to_text.write("User: " + userInput + " \n ")
            write_to_text.write(chatbot + ": Here's some resources: "+ " \n ")
            print("Here's some resources: ")
            print("Coming soon.") # add resources
            break
        
        # Following 911 question protocol
        elif("medical assistance" in userInput.lower() or "emergency" in userInput.lower()):
            write_to_text.write(chatbot + ": What is the location of the emergency? "+ " \n ")
            print("What is the location of the emergency? ")
            userInput =Check_isEmpty("What is the location of the emergency? ", input("User: "))
            write_to_text.write("User: " + userInput + " \n ")
            if("don't know" in userInput.lower() or "unsure" in userInput.lower()):
                write_to_text.write(chatbot + ": Any landmarks, parks, businesses nearby? "+ " \n ")
                print("Any landmarks, parks, businesses nearby? ")
                userInput =Check_isEmpty("Any landmarks, parks, businesses nearby? ", input("User: "))
                write_to_text.write("User: " + userInput + " \n ")
            
            write_to_text.write(chatbot + ": Please provide a reliable phone number. "+ " \n ")
            print("Please provide a reliable phone number. ")
            userInput =Check_isEmpty("Please provide a reliable phone number. ", input("User: "))
            write_to_text.write("User: " + userInput + " \n ")

            write_to_text.write(chatbot + ": What’s the problem? "+ " \n ")
            print("What’s the problem? ")
            userInput =Check_isEmpty("What’s the problem? ", input("User: "))
            write_to_text.write("User: " + userInput + " \n ")
            if(Natural_Disaster or Human_Caused_Disaster):
                write_to_text.write(chatbot + ": The emergency response is on the way.")
                print("The emergency response is on the way.")

            write_to_text.write(chatbot + ": Are there other people involved? "+ " \n ")
            print("Are there other people involved? ")
            userInput =Check_isEmpty("Are there other people involved? ", input("User: "))
            write_to_text.write("User: " + userInput + " \n ")

            write_to_text.write(chatbot + ": What kind of clothes are YOU wearing? "+ " \n ")
            print("What kind of clothes are YOU wearing? ")
            userInput =Check_isEmpty("What kind of clothes are YOU wearing? ", input("User: "))
            write_to_text.write("User: " + userInput + " \n ")

            write_to_text.write(chatbot + ": Are you inside or outside? "+ " \n ")
            print("Are you inside or outside? ")
            userInput =Check_isEmpty("Are you inside or outside? ", input("User: "))
            write_to_text.write("User: " + userInput + " \n ")
            write_to_text.write(chatbot + ": Please stay on the line. The emergency response is almost there.")
            print("Please stay on the line. The emergency response is almost there.")
            break

        elif userInput.lower() in Response_dept:
            write_to_text.write(chatbot + ": Redirecting to relevant emergency response department: "+ " \n ")
            print("Redirecting to relevant emergency response department: ")
            print("(This is a simulation.)") # be careful
            break

        elif userInput.lower() in Feelings:
            message = [
                "\nAre you safe?[Y/N] \n",
                "\nAre you able to sleep?[Y/N] \n",
                "\nAre you ok?[Y/N] \n"]
            write_to_text.write(chatbot + ": " f"{random.choice(message)}"+ " \n ")
            print(f"{random.choice(message)}")
            userInput =Check_isEmpty(f"{random.choice(message)}", input("User: "))
            write_to_text.write("User: " + userInput + " \n ")
            write_to_text.write(chatbot + ": Here's some coping tips: "+ " \n ")
            print("Here's some coping tips: ")
            print("Coming soon.") # add resources
            break 

        else:
            write_to_text.write(chatbot + ": Sorry! Invalid input."+ " \n ")
            print("Sorry! Invalid input.")
            break
        
    return

# Start of Program
write_to_text.write(chatbot + ": Hi! I'm Ávila. I'm here to assist you during natural disasters." + " \n ")
print("\nHi! I'm Ávila. I'm here to assist you during natural disasters.\n")
write_to_text.write(chatbot + ": What's your full name? " + " \n ")
print("What's your full name? ") 
name = Check_isEmpty(chatbot + ": What's your full name? ", input("User: ")) 
write_to_text.write("User: " + name + " \n ")

write_to_text.write(chatbot + ": Hi, " + name + ". How can I help you today? " + " \n ")
print("Hi, " + name + ". How can I help you today?")
userInput = Check_isEmpty("Hi, " + name + ". How can I help you today? ", input("User: "))
write_to_text.write("User: " + userInput + " \n ")
Issue(userInput)

# End
while True:
    write_to_text.write(chatbot + ": Is there anything else I can assist you with?[Y/N] "+ " \n ")
    print("Is there anything else I can assist you with?[Y/N] ")
    userInput =Check_isEmpty("Is there anything else I can assist you with?[Y/N] ", input("User: "))
    write_to_text.write("User: " + userInput + " \n ")
    if("n" in userInput.lower() or "no" in userInput.lower()):
        write_to_text.write(chatbot + ": Glad I could help. Take care and stay safe ❤️")
        print("Glad I could help. Take care and stay safe ❤️")
        write_to_text.close()
        sys.exit()
    elif("y" in userInput.lower() or "yes" in userInput.lower()):
        write_to_text.write(chatbot + ": What else can I assist you with? "+ " \n ")
        print("What else can I assist you with? ")
        userInput =Check_isEmpty("What else can I assist you with? ", input("User: "))
        write_to_text.write("User: " + userInput + " \n ")
        Issue(userInput)
