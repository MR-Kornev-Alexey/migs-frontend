import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Link from "@mui/material/Link";
import { Notepad } from "@phosphor-icons/react";

// Определение интерфейса для пропсов компонента
interface BasicCardProps {
  url: string;
}

const BasicCard: React.FC<BasicCardProps> = ({ url }) => {
  return (
    <Box sx={{ minWidth: 200 }}>
      <Card variant="outlined">
        <CardContent sx={{display: "flex", justifyContent: "center"}}>
          <Notepad size={50} />
        </CardContent>
        <CardActions sx={{display: "flex", justifyContent: "center"}}>
          <Link href={url} target="_blank" underline="none">
            <Button size="small" sx={{color: '#666666'}}>Открыть</Button>
          </Link>
          <Button size="small" sx={{color: '#666666'}} >Удалить</Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default BasicCard;
