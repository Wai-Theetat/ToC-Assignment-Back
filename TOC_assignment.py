import re

def main(text_log: str):
    try:
        match = re.search(r'(.*?) DOB:(.*)', text_log, re.DOTALL)

        part1 = match.group(1)
        credit_card, email, tel = part1.split()

        part2 = match.group(2)

        part2_split = re.search(r'(.*?) Address: (.*)', part2, re.DOTALL)

        date_of_birth = part2_split.group(1)
        address = part2_split.group(2)

        return f"{censor_credit_card(credit_card)} {mask_mail(email)} {censor_tel(tel)} {censor_DOB(date_of_birth)} {censor_address(address)}"
    except Exception as error:
        return f"Error : {error}"


def censor_credit_card(credit_card):

    newFormat = re.sub(r'(\d{4})-(\d{4})-(\d{4})-(\d{4})', r'XXXX-XXXX-XXXX-\4', credit_card)
    return f"{newFormat}"

def censor_tel(tel):
    
    newFormat = re.sub(r'(\d{3})-(\d{3})-(\d{4})', r'XXX-XXX-\3', tel)
    return f"{newFormat}"

def mask_mail(text):
    pattern = r'([\w.+-])([\w.+-]+)([\w.+-])@([\w.-]+\.[\w.]+)'
    return re.sub(pattern, lambda m: f'{m.group(1)}{"X"*len(m.group(2))}{m.group(3)}@{m.group(4)}', text)

def censor_DOB(DOB):
    def mask_DOB(match):
        
        third = match.group(3)
        fourth = match.group(4)
        return f"XX/XX/{third}{len(fourth) * 'X'}"
    
    newFormat = re.sub(r'(\d{1,2})/(\d{1,2})/(\d{2})(\d+)', mask_DOB, DOB)
    return f"DOB:{newFormat}"

def censor_address(address):
    def mask_digits(match):
        return re.sub(r'\d', 'X', match.group())
    
    newformat = re.sub(r'\d+(?:/\d+)?', mask_digits, address, count=1)
    return f"Address: {newformat}"


if __name__ == "__main__":
    text_log : str = "1234-5678-9012-3456 somchai.d@company.com 093-245-7894 DOB:25/12/2549 Address: 689 ซอยลาดกระบัง 19 ถนนลาดกระบัง แขวงลาดกระบัง เขตลำดกระบัง กรุงเทพฯ"
    result = main(text_log)
    print(result)